package com.yo1000.mailhoo.domain

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

/**
 *
 * @author yo1000
 */
@Repository
interface MessageRepositoryForUnread : JpaRepository<Message, String> {
    @Query(
        """
        SELECT DISTINCT
            m
        FROM
            Message m
        WHERE
            m.unread = :unread
    """
    )
    fun findAllByUnread(
        @Param("unread") unread: Boolean,
        pageable: Pageable
    ): Page<Message>
}
