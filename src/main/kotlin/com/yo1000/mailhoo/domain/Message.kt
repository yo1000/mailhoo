package com.yo1000.mailhoo.domain

import java.util.*
import javax.persistence.*

/**
 *
 * @author yo1000
 */
@Entity
data class Message(
    @Id
    val id: String = UUID.randomUUID().toString(),
    val messageId: String,
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn
    val sentFrom: Set<SentFrom>,
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn
    val receivedTo: Set<ReceivedTo>,
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn
    val receivedCc: Set<ReceivedCc>,
    // Declare immutable var, because requires lazy updates but JPA not supported copy().
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn
    var receivedBcc: Set<ReceivedBcc>,
    val subject: String?,
    val plainContent: String?,
    val htmlContent: String?,
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn
    val attachments: Set<Attachment>,
    val sentDate: Date,
    val receivedDate: Date,
    @Lob
    val headers: String,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn
    val raw: MessageRaw?,
)
