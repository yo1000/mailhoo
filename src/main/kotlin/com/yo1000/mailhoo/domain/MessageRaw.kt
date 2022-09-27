package com.yo1000.mailhoo.domain

import com.fasterxml.jackson.annotation.JsonIgnore
import org.hibernate.Hibernate
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Lob

@Entity
data class MessageRaw(
    @Id
    val id: String = UUID.randomUUID().toString(),
    @Lob
    @JsonIgnore
    val bytes: ByteArray,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as MessageRaw

        return id != null && id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
