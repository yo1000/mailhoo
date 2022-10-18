package com.yo1000.mailhoo.domain

import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Index
import javax.persistence.Table

@Entity
@Table(
    indexes = [
        Index(name = "idx_Attachment_fileName", columnList = "fileName")
    ]
)
data class Attachment(
    @Id
    val id: String = UUID.randomUUID().toString(),
    val fileName: String,
    val contentType: String,
)
