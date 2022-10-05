package com.yo1000.mailhoo

import com.yo1000.mailhoo.domain.*
import org.apache.commons.codec.net.QuotedPrintableCodec
import org.apache.commons.mail.util.MimeMessageParser
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.domain.Example
import org.springframework.data.domain.ExampleMatcher
import org.subethamail.wiser.Wiser
import org.subethamail.wiser.WiserMessage
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.nio.charset.Charset
import java.util.*
import javax.mail.Header
import javax.mail.internet.InternetAddress
import javax.mail.internet.MimeMessage

typealias RecipientType = javax.mail.Message.RecipientType

/**
 *
 * @author yo1000
 */
@Configuration
@EnableConfigurationProperties(SmtpConfigurationProperties::class)
class SmtpConfig(
    private val props: SmtpConfigurationProperties
) {
    @Bean
    fun receivedBccAggregator(
        messageRepos: MessageRepository,
        receivedBccRepos: ReceivedBccRepository,
        addressRepos: AddressRepository,
    ): ReceivedBccAggregator {
        return ReceivedBccAggregator(
            timeoutMillis = 30_000L,
            intervalMillis = 10_000L,
            messageRepos = messageRepos,
            receivedBccRepos = receivedBccRepos,
            addressRepos = addressRepos,
        )
    }

    @Bean
    fun wiser(
        messageRepos: MessageRepository,
        messageRawRepos: MessageRawRepository,
        sentFromRepos: SentFromRepository,
        receivedToRepos: ReceivedToRepository,
        receivedCcRepos: ReceivedCcRepository,
        receivedBccRepos: ReceivedBccRepository,
        addressRepos: AddressRepository,
        attachmentRepos: AttachmentRepository,
        receivedBccAggregator: ReceivedBccAggregator,
    ): Wiser {
        return object : Wiser(props.port ?: throw NullPointerException("SMTP Port is null")) {
            init {
                receivedBccAggregator.start()
            }

            override fun deliver(from: String?, recipient: String?, data: InputStream?) {
                super.deliver(from, recipient, data)

                val wiserMessage: WiserMessage = messages.last()
                val mimeMessage: MimeMessage = wiserMessage.mimeMessage

                fun AddressRepository.findOrSave(address: Address): Address {
                    return findOne(Example.of(
                        address,
                        ExampleMatcher.matching().withIgnorePaths(
                            Address::id.name,
                            Address::domain.name
                        )
                    )).orElseGet { save(address) }
                }

                if (recipient != null) {
                    receivedBccAggregator.addAddress(mimeMessage.messageID, recipient)
                }

                if (!messageRepos.existsByMessageId(mimeMessage.messageID)) {
                    ByteArrayOutputStream().use {
                        mimeMessage.writeTo(it)

                        val messageParser: MimeMessageParser = MimeMessageParser(mimeMessage).also {
                            it.parse()
                        }

                        Message(
                            messageId = mimeMessage.messageID,
                            sentFrom = setOf(SentFrom(
                                address = addressRepos.findOrSave(Address(
                                    displayName = wiserMessage.envelopeSenderDisplayName,
                                    email = wiserMessage.envelopeSender,
                                )),
                            ).let {
                                sentFromRepos.save(it)
                            }),
                            receivedTo = mimeMessage.getRecipients(RecipientType.TO)
                                ?.filterIsInstance<InternetAddress>()
                                ?.map {
                                    ReceivedTo(
                                        address = addressRepos.findOrSave(Address(
                                            displayName = it.personal,
                                            email = it.address,
                                        )),
                                    ).let {
                                        receivedToRepos.save(it)
                                    }
                                }?.toSet() ?: emptySet(),
                            receivedCc = mimeMessage.getRecipients(RecipientType.CC)
                                ?.filterIsInstance<InternetAddress>()
                                ?.map {
                                    ReceivedCc(
                                        address = addressRepos.findOrSave(Address(
                                            displayName = it.personal,
                                            email = it.address,
                                        )),
                                    ).let {
                                        receivedCcRepos.save(it)
                                    }
                                }?.toSet() ?: emptySet(),
                            receivedBcc = mimeMessage.getRecipients(RecipientType.BCC)
                                ?.filterIsInstance<InternetAddress>()
                                ?.map {
                                    ReceivedBcc(
                                        address = addressRepos.findOrSave(Address(
                                            displayName = it.personal,
                                            email = it.address,
                                        )),
                                    ).let {
                                        receivedBccRepos.save(it)
                                    }
                                }?.toSet() ?: emptySet(),
                            subject = mimeMessage.subject,
                            plainContent = messageParser.plainContent,
                            htmlContent = messageParser.htmlContent,
                            attachments = messageParser.attachmentList.map {
                                Attachment(
                                    contentType = it.contentType,
                                    fileName = it.name,
                                ).let {
                                    attachmentRepos.save(it)
                                }
                            }.toSet(),
                            sentDate = mimeMessage.sentDate,
                            receivedDate = Date(),
                            headers = mimeMessage.allHeaderLines.toList().joinToString(separator = "\n"),
                            raw = MessageRaw(
                                bytes = it.toByteArray(),
                            ).let {
                                messageRawRepos.save(it)
                            }
                        ).let {
                            messageRepos.save(it)
                        }
                    }
                }
            }
        }.also {
            it.start()
        }
    }

    private fun WiserMessage.findDisplayName(isSender: Boolean): String? {
        val headerNames: List<String> =
            if (isSender) { listOf("From") }
            else { listOf("To", "Cc", "Bcc") }

        val email =
            if (isSender) { envelopeSender }
            else { envelopeReceiver }

        return mimeMessage.allHeaders.toList()
            .filterIsInstance<Header>()
            .filter {
                headerNames.any { n -> it.name.equals(n, true) }
            }
            .map { it.value }
            .flatMap { it.split(Regex("\\s*,\\s*")) }
            .filter { it.contains("<${email}>", true) }
            .map {
                val result: MatchResult? = Regex("^=\\?([^?]+)\\?([QqBb])\\?(.*)\\?=").find(it)

                val encode: String? = result?.groupValues?.get(1)
                val encodeType: String? = result?.groupValues?.get(2)
                val encodedValue: String? = result?.groupValues?.get(3)

                when (encodeType?.uppercase()) {
                    "B" -> String(Base64.getDecoder().decode(encodedValue), Charset.forName(encode))
                    "Q" -> QuotedPrintableCodec(encode).decode(encodedValue)
                    else -> null
                }
            }
            .firstOrNull()
    }

    val WiserMessage.envelopeSenderDisplayName: String? get() {
        return findDisplayName(true)
    }

    val WiserMessage.envelopeReceiverDisplayName: String? get() {
        return findDisplayName(false)
    }
}

@ConfigurationProperties(prefix = "mailhoo.smtp")
class SmtpConfigurationProperties(
    var port: Int?
)

class ReceivedBccAggregator(
    private val timeoutMillis: Long = 30_000L,
    private val intervalMillis: Long = 10_000L,
    private val messageRepos: MessageRepository,
    private val receivedBccRepos: ReceivedBccRepository,
    private val addressRepos: AddressRepository,
) : Thread() {
    private val received: MutableMap<String, ExpirableMutableList> = mutableMapOf()

    override fun run() {
        while (true) {
            flush()
            sleep(intervalMillis)
        }
    }

    fun addAddress(messageId: String, vararg address: String) {
        received[messageId] = (received[messageId]
            .takeIf { it != null } ?: ExpirableMutableList(mutableListOf(), timeoutMillis))
            .also { it.addAll(address) }
    }

    fun flush() {
        val now = System.currentTimeMillis()

        received
            .filter { it.value.isExpired(now) }
            .forEach {
                flush(it)
                received.remove(it.key)
            }
    }

    private fun flush(entry: Map.Entry<String, ExpirableMutableList>) {
        fun AddressRepository.findOrSave(address: Address): Address {
            return findOne(Example.of(
                address,
                ExampleMatcher.matching().withIgnorePaths(
                    Address::id.name,
                    Address::domain.name
                )
            )).orElseGet { save(address) }
        }

        messageRepos.findByMessageId(entry.key)?.let {
            entry.value.removeAll(it.receivedTo.map { it.address.email })
            entry.value.removeAll(it.receivedCc.map { it.address.email })

            it.receivedBcc = it.receivedBcc + entry.value
                .map {
                    ReceivedBcc(address = addressRepos.findOrSave(Address(
                        displayName = null,
                        email = it
                    ))).let {
                        receivedBccRepos.save(it)
                    }
                }.toSet()

            messageRepos.save(it)
        }
    }

    private class ExpirableMutableList(
        private val delegator: MutableList<String>,
        private val timeoutMillis: Long
    ) : MutableList<String> by delegator {
        private var lastModified: Long = System.currentTimeMillis()
        override fun addAll(elements: Collection<String>): Boolean {
            if (elements.isEmpty()) return false

            lastModified = System.currentTimeMillis()
            return delegator.addAll(elements)
        }

        override fun removeAll(elements: Collection<String>): Boolean {
            if (elements.isEmpty()) return false

            return delegator.removeAll(elements)
        }

        fun isExpired(currentTimeInMillis: Long): Boolean {
            return currentTimeInMillis > lastModified + timeoutMillis
        }
    }
}
