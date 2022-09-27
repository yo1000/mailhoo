package com.yo1000.mailhoo.presentation

import com.yo1000.mailhoo.domain.Message
import com.yo1000.mailhoo.domain.MessageRawRepository
import com.yo1000.mailhoo.domain.MessageRepository
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
            sort = ["receivedDate"],
            direction = Sort.Direction.DESC,
        )
        pageable: Pageable,
    ): Page<Message> {
        return when {
            fromDomainName != null -> messageRepos.findAllBySentFromDomain(fromDomainName, pageable)
            toDomainName != null -> messageRepos.findAllByReceivedToDomain(toDomainName, pageable)
            ccDomainName != null -> messageRepos.findAllByReceivedCcDomain(ccDomainName, pageable)
            bccDomainName != null -> messageRepos.findAllByReceivedBccDomain(bccDomainName, pageable)
            else -> messageRepos.findAll(pageable)
        }
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
        return messageRepos.findById(id).orElseThrow {
            throw NullPointerException("Missing message")
        }.attachments.find { it.fileName == fileName }?.let { attachment ->
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
        @RequestParam("q")
        q: String,
        pageable: Pageable,
    ): Page<Message> {
        return messageRepos.findAllByQuery(q, pageable)
    }

    @ExceptionHandler(NullPointerException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun handleNotFound(e: Exception) {}
}
