package com.yo1000.mailhoo.presentation

import com.yo1000.mailhoo.domain.*
import org.apache.commons.mail.util.MimeMessageParser
import org.springframework.core.io.InputStreamResource
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.util.MimeTypeUtils
import org.springframework.web.bind.annotation.*
import org.springframework.web.util.UriUtils
import java.io.ByteArrayInputStream
import java.util.*
import javax.mail.Session
import javax.mail.internet.MimeMessage

/**
 *
 * @author yo1000
 */
@RestController
@RequestMapping("/messages")
class MessageRestController(
    private val messageRepos: MessageRepository,
    private val messageFromRepos: MessageRepositoryForSentFromDomain,
    private val messageToRepos: MessageRepositoryForReceivedToDomain,
    private val messageCcRepos: MessageRepositoryForReceivedCcDomain,
    private val messageBccRepos: MessageRepositoryForReceivedBccDomain,

    private val messageSearchSubjectRepo: MessageSearchRepositoryForSubject,
    private val messageSearchContentRepo: MessageSearchRepositoryForContent,
    private val messageSearchFromRepo: MessageSearchRepositoryForSentFrom,
    private val messageSearchToRepo: MessageSearchRepositoryForReceivedTo,
    private val messageSearchCcRepo: MessageSearchRepositoryForReceivedCc,
    private val messageSearchBccRepo: MessageSearchRepositoryForReceivedBcc,
    private val messageSearchAttachmentRepo: MessageSearchRepositoryForAttachment,

    private val messageRawRepos: MessageRawRepository,
) {
    @GetMapping
    fun get(
        @RequestParam(
            name = "fromDomain",
            required = false,
        )
        fromDomainName: String?,
        @RequestParam(
            name = "toDomain",
            required = false,
        )
        toDomainName: String?,
        @RequestParam(
            name = "ccDomain",
            required = false,
        )
        ccDomainName: String?,
        @RequestParam(
            name = "bccDomain",
            required = false,
        )
        bccDomainName: String?,
        @PageableDefault(
            size = 20,
            page = 0,
            sort = ["seq"],
            direction = Sort.Direction.DESC,
        )
        pageable: Pageable,
    ): Page<Message> {
        return when {
            fromDomainName != null -> messageFromRepos.findAllByParam(fromDomainName, pageable)
            toDomainName != null -> messageToRepos.findAllByParam(toDomainName, pageable)
            ccDomainName != null -> messageCcRepos.findAllByParam(ccDomainName, pageable)
            bccDomainName != null -> messageBccRepos.findAllByParam(bccDomainName, pageable)
            else -> messageRepos.findAll(pageable)
        }
    }

    @GetMapping("/?seq=max")
    fun getBySeqMax(pageable: Pageable): Page<Message> {
        val maxSeq: Long = messageRepos.maxSeq() ?: 0

        return messageRepos.findAllBySeq(maxSeq, pageable)
    }

    @GetMapping("/{id}")
    fun getById(
        @PathVariable("id")
        id: String
    ): Message {
        return messageRepos.findById(id).orElseThrow {
            throw NullPointerException("Missing message")
        }
    }

    @PatchMapping("/{id}/unread")
    fun patchUnreadById(
        @PathVariable("id")
        id: String,
        @RequestBody
        unread: Boolean
    ) {
        val message: Message = getById(id)

        message.unread = unread

        messageRepos.save(message)
    }

    @GetMapping("/{id}/attachments/{fileName}",
        produces = [MimeTypeUtils.APPLICATION_OCTET_STREAM_VALUE],
        consumes = [
            MimeTypeUtils.APPLICATION_OCTET_STREAM_VALUE,
            MimeTypeUtils.APPLICATION_JSON_VALUE,
            MimeTypeUtils.TEXT_HTML_VALUE,
            MimeTypeUtils.TEXT_PLAIN_VALUE
        ]
    )
    fun getAttachmentResourceByIdAndFileName(
        @PathVariable("id")
        id: String,
        @PathVariable("fileName")
        fileName: String,
    ): ResponseEntity<InputStreamResource> {
        return getById(id).attachments.find { it.fileName == fileName }?.let { attachment ->
            ByteArrayInputStream(messageRawRepos.findByMessageId(id).bytes).use {
                MimeMessageParser(MimeMessage(
                    Session.getDefaultInstance(Properties()),
                    it
                )).also {
                    it.parse()
                }.findAttachmentByName(attachment.fileName)?.let {
                    ResponseEntity
                        .ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, """attachment; filename="${UriUtils.encode(fileName, Charsets.UTF_8)}" """)
                        .contentType(MediaType.parseMediaType(it.contentType))
                        .body(InputStreamResource(it.inputStream))

                }
            }
        } ?: throw NullPointerException("Missing attachment")
    }

    @GetMapping("/search")
    fun getSearch(
        @RequestParam(
            name = "subject",
            required = false,
        )
        subject: String?,
        @RequestParam(
            name = "content",
            required = false,
        )
        content: String?,
        @RequestParam(
            name = "from",
            required = false,
        )
        from: String?,
        @RequestParam(
            name = "to",
            required = false,
        )
        to: String?,
        @RequestParam(
            name = "cc",
            required = false,
        )
        cc: String?,
        @RequestParam(
            name = "bcc",
            required = false,
        )
        bcc: String?,
        @RequestParam(
            name = "attachment",
            required = false,
        )
        attachment: String?,
        @PageableDefault(
            size = 20,
            page = 0,
            sort = ["seq"],
            direction = Sort.Direction.DESC,
        )
        pageable: Pageable,
    ): Page<Message> {
        return when {
            subject != null -> messageSearchSubjectRepo.findAllByParam(subject, pageable)
            content != null -> messageSearchContentRepo.findAllByParam(content, pageable)
            from != null -> messageSearchFromRepo.findAllByParam(from, pageable)
            to != null -> messageSearchToRepo.findAllByParam(to, pageable)
            cc != null -> messageSearchCcRepo.findAllByParam(cc, pageable)
            bcc != null -> messageSearchBccRepo.findAllByParam(bcc, pageable)
            attachment != null -> messageSearchAttachmentRepo.findAllByParam(attachment, pageable)
            else -> messageRepos.findAll(pageable)
        }
    }

    @ExceptionHandler(NullPointerException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun handleNotFound(e: Exception) {
        // NOP
    }
}
