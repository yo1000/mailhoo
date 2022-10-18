package com.yo1000.mailhoo.presentation

import com.yo1000.mailhoo.domain.*
import org.apache.commons.mail.util.MimeMessageParser
import org.springframework.core.io.InputStreamResource
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
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
        @RequestParam(
            name = "prevSeq",
            required = false,
        )
        prevSeq: String?,
        @RequestParam(
            name = "nextSeq",
            required = false,
        )
        nextSeq: String?,
        @PageableDefault(
            size = 20,
            page = 0,
            sort = ["seq"],
            direction = Sort.Direction.DESC,
        )
        pageable: Pageable,
    ): Page<Message> {
        return getPagedMessages(
            fromDomainName, toDomainName, ccDomainName, bccDomainName,
            null, null, null, null, null, null, null,
            prevSeq, nextSeq, pageable
        )
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
        @RequestParam("f")
        f: String,
        @RequestParam(
            name = "prevSeq",
            required = false,
        )
        prevSeq: String?,
        @RequestParam(
            name = "nextSeq",
            required = false,
        )
        nextSeq: String?,
        seq: Long?,
        pageable: Pageable,
    ): Page<Message> {
        if (q.isEmpty()) return Page.empty()

        return getPagedMessages(
            fromDomainName = null,
            toDomainName = null,
            ccDomainName = null,
            bccDomainName = null,
            subjectQuery = if (f == "subject") q else null,
            contentQuery = if (f == "content") q else null,
            fromQuery = if (f == "from") q else null,
            toQuery = if (f == "to") q else null,
            ccQuery = if (f == "cc") q else null,
            bccQuery = if (f == "bcc") q else null,
            attachmentQuery = if (f == "attachment") q else null,
            prevSeqString = prevSeq,
            nextSeqString = nextSeq,
            pageable = pageable
        )
    }

    @ExceptionHandler(NullPointerException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun handleNotFound(e: Exception) {}

    private fun getPagedMessages(
        fromDomainName: String?, toDomainName: String?, ccDomainName: String?, bccDomainName: String?,
        subjectQuery: String?, contentQuery: String?, fromQuery: String?,
        toQuery: String?, ccQuery: String?, bccQuery: String?, attachmentQuery: String?,
        prevSeqString: String?, nextSeqString: String?, pageable: Pageable
    ): Page<Message> {
        val seqMax: Long = messageRepos.maxSeq()
            ?: return Page.empty()

        val prevSeq: Long? = if (prevSeqString == "max") {
            seqMax
        } else {
            prevSeqString?.let { it.toLong() - 1 }
        }

        val nextSeq: Long? = if (nextSeqString == "max") {
            seqMax
        } else {
            nextSeqString?.let { it.toLong() }
        }

        return when {
            prevSeq != null -> {
                var seqStartEq: Long =
                    if (prevSeq < 0) return Page.empty()
                    else prevSeq - pageable.pageSize + 1
                var seqEnd: Long = seqStartEq + pageable.pageSize

                val aggregator: MutableList<Message> = mutableListOf<Message>().addPagedQueryResults(
                    fromDomainName, toDomainName, ccDomainName, bccDomainName,
                    subjectQuery, contentQuery, fromQuery, toQuery, ccQuery, bccQuery, attachmentQuery,
                    seqStartEq, seqEnd,
                )
                var aggregationMax: Long = Long.MAX_VALUE
                var aggregationCountThreshold: Int = 10

                while (aggregator.size < pageable.pageSize && seqStartEq >= 0) {
                    seqStartEq = findMaxSeqForAggregator(fromDomainName, toDomainName, ccDomainName, bccDomainName,
                        subjectQuery, contentQuery, fromQuery, toQuery, ccQuery, bccQuery, attachmentQuery,
                        seqStartEq)?.let {
                        it - pageable.pageSize + 1
                    } ?: break
                    seqEnd = seqStartEq + pageable.pageSize

                    if (aggregationCountThreshold-- <= 0 && aggregationMax == Long.MAX_VALUE) {
                        aggregationMax = countBy(fromDomainName, toDomainName, ccDomainName, bccDomainName,
                            subjectQuery, contentQuery, fromQuery, toQuery, ccQuery, bccQuery, attachmentQuery)
                    }

                    if (aggregator.size >= aggregationMax) {
                        break
                    }

                    aggregator.addPagedQueryResults(
                        fromDomainName, toDomainName, ccDomainName, bccDomainName,
                        subjectQuery, contentQuery, fromQuery, toQuery, ccQuery, bccQuery, attachmentQuery,
                        seqStartEq, seqEnd,
                    )
                }

                object : PageImpl<Message>(
                    aggregator.sortedByDescending { it.seq }.let {
                        if (it.size > pageable.pageSize) it.subList(0, pageable.pageSize)
                        else it
                    },
                    pageable,
                    Long.MAX_VALUE
                ) {
                    override fun isFirst(): Boolean {
                        return content.first()?.let {
                            it.seq == findMaxSeqForPage(fromDomainName, toDomainName, ccDomainName, bccDomainName,
                                subjectQuery, contentQuery, fromQuery, toQuery, ccQuery, bccQuery, attachmentQuery)
                        } ?: true
                    }

                    override fun isLast(): Boolean {
                        return content.last()?.let {
                            it.seq == findMinSeqForPage(fromDomainName, toDomainName, ccDomainName, bccDomainName,
                                subjectQuery, contentQuery, fromQuery, toQuery, ccQuery, bccQuery, attachmentQuery)
                        } ?: true
                    }
                }
            }
            nextSeq != null -> {
                var seqStartEq: Long =
                    if (nextSeq > seqMax) seqMax - pageable.pageSize + 1
                    else nextSeq
                var seqEnd: Long = seqStartEq + pageable.pageSize

                val aggregator: MutableList<Message> = mutableListOf<Message>().addPagedQueryResults(
                    fromDomainName, toDomainName, ccDomainName, bccDomainName,
                    subjectQuery, contentQuery, fromQuery, toQuery, ccQuery, bccQuery, attachmentQuery,
                    seqStartEq, seqEnd,
                )
                var aggregationMax: Long = Long.MAX_VALUE
                var aggregationCountThreshold: Int = 10

                while (aggregator.size < pageable.pageSize && seqStartEq < seqMax) {
                    seqStartEq = findMinSeqForAggregator(fromDomainName, toDomainName, ccDomainName, bccDomainName,
                        subjectQuery, contentQuery, fromQuery, toQuery, ccQuery, bccQuery, attachmentQuery,
                        seqEnd) ?: break
                    seqEnd = seqStartEq + pageable.pageSize

                    if (aggregationCountThreshold-- <= 0 && aggregationMax == Long.MAX_VALUE) {
                        aggregationMax = countBy(fromDomainName, toDomainName, ccDomainName, bccDomainName,
                            subjectQuery, contentQuery, fromQuery, toQuery, ccQuery, bccQuery, attachmentQuery
                        )
                    }

                    if (aggregator.size >= aggregationMax) {
                        break
                    }

                    aggregator.addPagedQueryResults(fromDomainName, toDomainName, ccDomainName, bccDomainName,
                        subjectQuery, contentQuery, fromQuery, toQuery, ccQuery, bccQuery, attachmentQuery,
                        seqStartEq, seqEnd
                    )
                }

                object : PageImpl<Message>(
                    aggregator.sortedByDescending { it.seq }.let {
                        if (it.size > pageable.pageSize) it.subList(0, pageable.pageSize)
                        else it
                    },
                    pageable,
                    Long.MAX_VALUE
                ) {
                    override fun isFirst(): Boolean {
                        return content.first()?.let {
                            it.seq == findMaxSeqForPage(fromDomainName, toDomainName, ccDomainName, bccDomainName,
                                subjectQuery, contentQuery, fromQuery, toQuery, ccQuery, bccQuery, attachmentQuery)
                        } ?: true
                    }

                    override fun isLast(): Boolean {
                        return content.last()?.let {
                            it.seq == findMinSeqForPage(fromDomainName, toDomainName, ccDomainName, bccDomainName,
                                subjectQuery, contentQuery, fromQuery, toQuery, ccQuery, bccQuery, attachmentQuery)
                        } ?: true
                    }
                }
            }
            else -> {
                when {
                    fromDomainName != null -> messageFromRepos.findAllByParam(fromDomainName, pageable)
                    toDomainName != null -> messageToRepos.findAllByParam(toDomainName, pageable)
                    ccDomainName != null -> messageCcRepos.findAllByParam(ccDomainName, pageable)
                    bccDomainName != null -> messageBccRepos.findAllByParam(bccDomainName, pageable)
                    subjectQuery != null -> messageSearchSubjectRepo.findAllByParam(subjectQuery, pageable)
                    contentQuery != null -> messageSearchContentRepo.findAllByParam(contentQuery, pageable)
                    fromQuery != null -> messageSearchFromRepo.findAllByParam(fromQuery, pageable)
                    toQuery != null -> messageSearchToRepo.findAllByParam(toQuery, pageable)
                    ccQuery != null -> messageSearchCcRepo.findAllByParam(ccQuery, pageable)
                    bccQuery != null -> messageSearchBccRepo.findAllByParam(bccQuery, pageable)
                    attachmentQuery != null -> messageSearchAttachmentRepo.findAllByParam(attachmentQuery, pageable)
                    else -> messageRepos.findAll(pageable)
                }
            }
        }
    }

    private fun findMaxSeqForPage(
        fromDomainName: String?, toDomainName: String?, ccDomainName: String?, bccDomainName: String?,
        subjectQuery: String?, contentQuery: String?, fromQuery: String?,
        toQuery: String?, ccQuery: String?, bccQuery: String?, attachmentQuery: String?,
    ): Long? {
        return when {
            fromDomainName != null -> messageFromRepos.maxSeqByParam(fromDomainName)
            toDomainName != null -> messageToRepos.maxSeqByParam(toDomainName)
            ccDomainName != null -> messageCcRepos.maxSeqByParam(ccDomainName)
            bccDomainName != null -> messageBccRepos.maxSeqByParam(bccDomainName)
            subjectQuery != null -> messageSearchSubjectRepo.maxSeqByParam(subjectQuery)
            contentQuery != null -> messageSearchContentRepo.maxSeqByParam(contentQuery)
            fromQuery != null -> messageSearchFromRepo.maxSeqByParam(fromQuery)
            toQuery != null -> messageSearchToRepo.maxSeqByParam(toQuery)
            ccQuery != null -> messageSearchCcRepo.maxSeqByParam(ccQuery)
            bccQuery != null -> messageSearchBccRepo.maxSeqByParam(bccQuery)
            attachmentQuery != null -> messageSearchAttachmentRepo.maxSeqByParam(attachmentQuery)
            else -> messageRepos.maxSeq()
        }
    }

    private fun findMinSeqForPage(
        fromDomainName: String?, toDomainName: String?, ccDomainName: String?, bccDomainName: String?,
        subjectQuery: String?, contentQuery: String?, fromQuery: String?,
        toQuery: String?, ccQuery: String?, bccQuery: String?, attachmentQuery: String?,
    ): Long? {
        return when {
            fromDomainName != null -> messageFromRepos.minSeqByParam(fromDomainName)
            toDomainName != null -> messageToRepos.minSeqByParam(toDomainName)
            ccDomainName != null -> messageCcRepos.minSeqByParam(ccDomainName)
            bccDomainName != null -> messageBccRepos.minSeqByParam(bccDomainName)
            subjectQuery != null -> messageSearchSubjectRepo.minSeqByParam(subjectQuery)
            contentQuery != null -> messageSearchContentRepo.minSeqByParam(contentQuery)
            fromQuery != null -> messageSearchFromRepo.minSeqByParam(fromQuery)
            toQuery != null -> messageSearchToRepo.minSeqByParam(toQuery)
            ccQuery != null -> messageSearchCcRepo.minSeqByParam(ccQuery)
            bccQuery != null -> messageSearchBccRepo.minSeqByParam(bccQuery)
            attachmentQuery != null -> messageSearchAttachmentRepo.minSeqByParam(attachmentQuery)
            else -> messageRepos.minSeq()
        }
    }

    private fun findMaxSeqForAggregator(
        fromDomainName: String?, toDomainName: String?, ccDomainName: String?, bccDomainName: String?,
        subjectQuery: String?, contentQuery: String?, fromQuery: String?,
        toQuery: String?, ccQuery: String?, bccQuery: String?, attachmentQuery: String?,
        seq: Long,
    ): Long? {
        return when {
            fromDomainName != null -> messageFromRepos.maxSeqByParamAndSeqLessThan(fromDomainName, seq)
            toDomainName != null -> messageToRepos.maxSeqByParamAndSeqLessThan(toDomainName, seq)
            ccDomainName != null -> messageCcRepos.maxSeqByParamAndSeqLessThan(ccDomainName, seq)
            bccDomainName != null -> messageBccRepos.maxSeqByParamAndSeqLessThan(bccDomainName, seq)
            subjectQuery != null -> messageSearchSubjectRepo.maxSeqByParamAndSeqLessThan(subjectQuery, seq)
            contentQuery != null -> messageSearchContentRepo.maxSeqByParamAndSeqLessThan(contentQuery, seq)
            fromQuery != null -> messageSearchFromRepo.maxSeqByParamAndSeqLessThan(fromQuery, seq)
            toQuery != null -> messageSearchToRepo.maxSeqByParamAndSeqLessThan(toQuery, seq)
            ccQuery != null -> messageSearchCcRepo.maxSeqByParamAndSeqLessThan(ccQuery, seq)
            bccQuery != null -> messageSearchBccRepo.maxSeqByParamAndSeqLessThan(bccQuery, seq)
            attachmentQuery != null -> messageSearchAttachmentRepo.maxSeqByParamAndSeqLessThan(attachmentQuery, seq)
            else -> messageRepos.maxSeqBySeqLessThan(seq)
        }
    }

    private fun findMinSeqForAggregator(
        fromDomainName: String?, toDomainName: String?, ccDomainName: String?, bccDomainName: String?,
        subjectQuery: String?, contentQuery: String?, fromQuery: String?,
        toQuery: String?, ccQuery: String?, bccQuery: String?, attachmentQuery: String?,
        seq: Long,
    ): Long? {
        return when {
            fromDomainName != null -> messageFromRepos.minSeqByParamAndSeqGreaterThanEquals(fromDomainName, seq)
            toDomainName != null -> messageToRepos.minSeqByParamAndSeqGreaterThanEquals(toDomainName, seq)
            ccDomainName != null -> messageCcRepos.minSeqByParamAndSeqGreaterThanEquals(ccDomainName, seq)
            bccDomainName != null -> messageBccRepos.minSeqByParamAndSeqGreaterThanEquals(bccDomainName, seq)
            subjectQuery != null -> messageSearchSubjectRepo.minSeqByParamAndSeqGreaterThanEquals(subjectQuery, seq)
            contentQuery != null -> messageSearchContentRepo.minSeqByParamAndSeqGreaterThanEquals(contentQuery, seq)
            fromQuery != null -> messageSearchFromRepo.minSeqByParamAndSeqGreaterThanEquals(fromQuery, seq)
            toQuery != null -> messageSearchToRepo.minSeqByParamAndSeqGreaterThanEquals(toQuery, seq)
            ccQuery != null -> messageSearchCcRepo.minSeqByParamAndSeqGreaterThanEquals(ccQuery, seq)
            bccQuery != null -> messageSearchBccRepo.minSeqByParamAndSeqGreaterThanEquals(bccQuery, seq)
            attachmentQuery != null -> messageSearchAttachmentRepo.minSeqByParamAndSeqGreaterThanEquals(attachmentQuery, seq)
            else -> messageRepos.minSeqBySeqGreaterThanEquals(seq)
        }
    }

    private fun countBy(
        fromDomainName: String?, toDomainName: String?, ccDomainName: String?, bccDomainName: String?,
        subjectQuery: String?, contentQuery: String?, fromQuery: String?,
        toQuery: String?, ccQuery: String?, bccQuery: String?, attachmentQuery: String?,
    ): Long {
        return when {
            fromDomainName != null -> messageFromRepos.countByParam(fromDomainName)
            toDomainName != null -> messageToRepos.countByParam(toDomainName)
            ccDomainName != null -> messageCcRepos.countByParam(ccDomainName)
            bccDomainName != null -> messageBccRepos.countByParam(bccDomainName)
            subjectQuery != null -> messageSearchSubjectRepo.countByParam(subjectQuery)
            contentQuery != null -> messageSearchContentRepo.countByParam(contentQuery)
            fromQuery != null -> messageSearchFromRepo.countByParam(fromQuery)
            toQuery != null -> messageSearchToRepo.countByParam(toQuery)
            ccQuery != null -> messageSearchCcRepo.countByParam(ccQuery)
            bccQuery != null -> messageSearchBccRepo.countByParam(bccQuery)
            attachmentQuery != null -> messageSearchAttachmentRepo.countByParam(attachmentQuery)
            else -> messageRepos.count()
        }
    }

    private fun MutableList<Message>.addPagedQueryResults(
        fromDomainName: String?, toDomainName: String?, ccDomainName: String?, bccDomainName: String?,
        subjectQuery: String?, contentQuery: String?, fromQuery: String?,
        toQuery: String?, ccQuery: String?, bccQuery: String?, attachmentQuery: String?,
        seqStartEq: Long, seqEnd: Long
    ): MutableList<Message> {
        addAll(when {
            fromDomainName != null -> messageFromRepos.findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(fromDomainName, seqStartEq, seqEnd)
            toDomainName != null -> messageToRepos.findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(toDomainName, seqStartEq, seqEnd)
            ccDomainName != null -> messageCcRepos.findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(ccDomainName, seqStartEq, seqEnd)
            bccDomainName != null -> messageBccRepos.findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(bccDomainName, seqStartEq, seqEnd)
            subjectQuery != null -> messageSearchSubjectRepo.findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(subjectQuery, seqStartEq, seqEnd)
            contentQuery != null -> messageSearchContentRepo.findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(contentQuery, seqStartEq, seqEnd)
            fromQuery != null -> messageSearchFromRepo.findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(fromQuery, seqStartEq, seqEnd)
            toQuery != null -> messageSearchToRepo.findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(toQuery, seqStartEq, seqEnd)
            ccQuery != null -> messageSearchCcRepo.findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(ccQuery, seqStartEq, seqEnd)
            bccQuery != null -> messageSearchBccRepo.findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(bccQuery, seqStartEq, seqEnd)
            attachmentQuery != null -> messageSearchAttachmentRepo.findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(attachmentQuery, seqStartEq, seqEnd)
            else -> messageRepos.findAllBySeqLessThanAndSeqGreaterThanEquals(seqStartEq, seqEnd)
        })

        return this
    }
}
