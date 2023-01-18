package com.yo1000.mailhoo.domain

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Lob
import org.hibernate.Hibernate
import org.hibernate.Length
import java.util.*

@Entity
data class MessageRaw(
    @Id
    val id: String = UUID.randomUUID().toString(),
    @Column(length = Length.LONG32)
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
