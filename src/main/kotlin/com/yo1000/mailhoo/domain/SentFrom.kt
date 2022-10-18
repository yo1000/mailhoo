package com.yo1000.mailhoo.domain

import java.util.*
import javax.persistence.*

/**
 *
 * @author yo1000
 */
@Entity
@Table(
    indexes = [
        Index(name = "idx_SentFrom_addressId", columnList = "address_id", unique = false),
    ]
)
data class SentFrom(
    @Id
    val id: String = UUID.randomUUID().toString(),
    @ManyToOne
    val address: Address,
)
