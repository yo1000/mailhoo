package com.yo1000.mailhoo.domain

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Index
import jakarta.persistence.Table
import java.util.*

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
