package com.yo1000.mailhoo.domain

import java.util.*
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class Attachment(
    @Id
    val id: String = UUID.randomUUID().toString(),
    val fileName: String,
    val contentType: String,
)
