package com.yo1000.mailhoo.domain

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

/**
 *
 * @author yo1000
 */
@Repository
interface MessageRepository : JpaRepository<Message, String> {
    fun existsByMessageId(messageId: String): Boolean

    @EntityGraph(
        attributePaths = ["messageId", "receivedTo", "receivedCc", "receivedBcc"],
        type = EntityGraph.EntityGraphType.LOAD
    )
    fun findByMessageId(@Param("messageId") messageId: String): Message?

    @EntityGraph(
        attributePaths = ["messageId", "receivedTo", "receivedCc", "receivedBcc"],
        type = EntityGraph.EntityGraphType.LOAD
    )
    fun findAllBySeq(
        @Param("seq") seq: Long,
        pageable: Pageable
    ): Page<Message>

    @Query(
        """
        SELECT
            MAX(m.seq)
        FROM
            Message m
    """
    )
    fun maxSeq(): Long?
}
