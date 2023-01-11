package com.yo1000.mailhoo.domain

import org.hibernate.annotations.Type
import java.util.*
import javax.persistence.*

/**
 *
 * @author yo1000
 */
@Entity
@Table(
    indexes = [
        Index(name = "idx_Message_messageId", columnList = "messageId", unique = true),
        Index(name = "idx_Message_seq", columnList = "seq", unique = true),
        Index(name = "idx_Message_receivedDate_desc", columnList = "receivedDate DESC"),
        Index(name = "idx_Message_unread_receivedDate_desc", columnList = "unread, receivedDate DESC")
    ]
)
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
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    val subject: String?,
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    val plainContent: String?,
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    val htmlContent: String?,
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn
    val attachments: Set<Attachment>,
    val sentDate: Date,
    val receivedDate: Date,
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    val headers: String,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn
    val raw: MessageRaw?,
    var unread: Boolean?,
    val seq: Long
)
