package com.yo1000.mailhoo.domain

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Index
import jakarta.persistence.Table
import java.util.*

/**
 *
 * @author yo1000
 */
@Entity
@Table(
    indexes = [
        Index(name = "idx_Address_email", columnList = "email"),
        Index(name = "idx_Address_domain", columnList = "domain"),
    ]
)
data class Address(
    @Id
    val id: String = UUID.randomUUID().toString(),
    val displayName: String?,
    val email: String,
    val domain: String = email.replaceFirst(Regex("^.+@"), ""),
)
