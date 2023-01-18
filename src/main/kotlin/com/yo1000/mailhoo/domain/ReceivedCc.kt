package com.yo1000.mailhoo.domain

import jakarta.persistence.*
import java.util.*

/**
 *
 * @author yo1000
 */
@Entity
@Table(
    indexes = [
        Index(name = "idx_ReceivedCc_addressId", columnList = "address_id", unique = false),
    ]
)
data class ReceivedCc(
    @Id
    val id: String = UUID.randomUUID().toString(),
    @ManyToOne
    val address: Address,
)
