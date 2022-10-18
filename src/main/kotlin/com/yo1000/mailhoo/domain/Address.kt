package com.yo1000.mailhoo.domain

import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Index
import javax.persistence.Table

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
