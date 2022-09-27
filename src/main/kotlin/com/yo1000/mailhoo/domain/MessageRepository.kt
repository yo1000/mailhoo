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
interface MessageRepository : JpaRepository<Message, String> {
    fun existsByMessageId(messageId: String): Boolean

    @Query(
        """
        SELECT DISTINCT
            m
        FROM
            Message m
        INNER JOIN 
            m.sentFrom f
        INNER JOIN 
            f.address a
        WHERE
            a.domain = :domain
    """
    )
    fun findAllBySentFromDomain(@Param("domain") domain: String, pageable: Pageable): Page<Message>

    @Query(
        """
        SELECT DISTINCT
            m
        FROM
            Message m
        INNER JOIN 
            m.receivedTo t
        INNER JOIN 
            t.address a
        WHERE
            a.domain = :domain
    """
    )
    fun findAllByReceivedToDomain(@Param("domain") domain: String, pageable: Pageable): Page<Message>

    @Query(
        """
        SELECT DISTINCT
            m
        FROM
            Message m
        INNER JOIN 
            m.receivedCc c
        INNER JOIN 
            c.address a
        WHERE
            a.domain = :domain
    """
    )
    fun findAllByReceivedCcDomain(@Param("domain") domain: String, pageable: Pageable): Page<Message>

    @Query(
        """
        SELECT DISTINCT
            m
        FROM
            Message m
        INNER JOIN 
            m.receivedBcc b
        INNER JOIN 
            b.address a
        WHERE
            a.domain = :domain
    """
    )
    fun findAllByReceivedBccDomain(@Param("domain") domain: String, pageable: Pageable): Page<Message>

    @Query(
        """
        SELECT DISTINCT
            m
        FROM
            Message m
        LEFT OUTER JOIN 
            m.attachments att
        LEFT OUTER JOIN 
            m.sentFrom f
        LEFT OUTER JOIN 
            f.address fa
        LEFT OUTER JOIN 
            m.receivedTo t
        LEFT OUTER JOIN 
            t.address ta
        LEFT OUTER JOIN 
            m.receivedCc c
        LEFT OUTER JOIN 
            c.address ca
        LEFT OUTER JOIN 
            m.receivedBcc b
        LEFT OUTER JOIN 
            b.address ba
        WHERE
            m.subject LIKE CONCAT('%', :q, '%')
        OR
            m.plainContent LIKE CONCAT('%', :q, '%')
        OR
            m.htmlContent LIKE CONCAT('%', :q, '%')
        OR
            att.fileName LIKE CONCAT('%', :q, '%')
        OR
            fa.email LIKE CONCAT('%', :q, '%')
        OR
            fa.displayName LIKE CONCAT('%', :q, '%')
        OR
            ta.email LIKE CONCAT('%', :q, '%')
        OR
            ta.displayName LIKE CONCAT('%', :q, '%')
        OR
            ca.email LIKE CONCAT('%', :q, '%')
        OR
            ca.displayName LIKE CONCAT('%', :q, '%')
        OR
            ba.email LIKE CONCAT('%', :q, '%')
        OR
            ba.displayName LIKE CONCAT('%', :q, '%')
    """
    )
    fun findAllByQuery(@Param("q") q: String, pageable: Pageable): Page<Message>
}
