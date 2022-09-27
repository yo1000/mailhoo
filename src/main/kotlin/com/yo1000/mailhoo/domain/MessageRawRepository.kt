package com.yo1000.mailhoo.domain

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

/**
 *
 * @author yo1000
 */
@Repository
interface MessageRawRepository : JpaRepository<MessageRaw, String> {
    @Query("""
        SELECT
            r
        FROM
            Message m
        INNER JOIN
            m.raw r
        WHERE
            m.id = :messageId
    """)
    fun findByMessageId(@Param("messageId") messageId: String): MessageRaw
}
