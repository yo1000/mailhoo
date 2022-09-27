package com.yo1000.mailhoo.domain

import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.ManyToOne

/**
 *
 * @author yo1000
 */
@Entity
data class ReceivedBcc(
    @Id
    val id: String = UUID.randomUUID().toString(),
    @ManyToOne
    val address: Address,
)
