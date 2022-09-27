package com.yo1000.mailhoo.domain

import java.util.*
import javax.persistence.Entity
import javax.persistence.Id

/**
 *
 * @author yo1000
 */
@Entity
data class Address(
    @Id
    val id: String = UUID.randomUUID().toString(),
    val displayName: String?,
    val email: String,
    val domain: String = email.replaceFirst(Regex("^.+@"), ""),
)
