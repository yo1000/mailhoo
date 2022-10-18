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
interface MessageSearchRepository : JpaRepository<Message, String> {
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
    fun findAllByQuery(
        @Param("q") q: String,
        pageable: Pageable
    ): Page<Message>

    @Query(
        """
        SELECT
            m
        FROM
            Message m
        WHERE
            m.id IN (
                SELECT DISTINCT
                    m.id
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
                (
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
                )
            )
        AND
            m.seq >= :seqGte
        AND
            m.seq < :seqLt
    """
    )
    fun findAllByQueryAndSeqRange(
        @Param("q") q: String,
        @Param("seqGte") seqGte: Long,
        @Param("seqLt") seqLt: Long
    ): List<Message>

    @Query(
        """
        SELECT
            MAX(m.seq)
        FROM
            Message m
        WHERE
            m.id IN (
                SELECT DISTINCT
                    m.id
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
                (
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
                )
            )
    """
    )
    fun findMaxSeqByQuery(
        @Param("q") q: String
    ): Long?

    @Query(
        """
        SELECT
            MIN(m.seq)
        FROM
            Message m
        WHERE
            m.id IN (
                SELECT DISTINCT
                    m.id
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
                (
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
                )
            )
    """
    )
    fun findMinSeqByQuery(
        @Param("q") q: String
    ): Long?

    @Query(
        """
        SELECT
            MAX(m.seq)
        FROM
            Message m
        WHERE
            m.id IN (
                SELECT DISTINCT
                    m.id
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
                (
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
                )
            )
        AND
            m.seq < :seqLt
    """
    )
    fun findMaxSeqByQueryAndSeqLessThan(
        @Param("q") q: String,
        @Param("seqLt") seqLt: Long,
    ): Long?

    @Query(
        """
        SELECT
            MIN(m.seq)
        FROM
            Message m
        WHERE
            m.id IN (
                SELECT DISTINCT
                    m.id
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
                (
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
                )
            )
        AND
            m.seq >= :seqGte
    """
    )
    fun findMinSeqByQueryAndSeqGreaterThanEquals(
        @Param("q") q: String,
        @Param("seqGte") seqGte: Long,
    ): Long?

    @Query(
        """
        SELECT
            count(DISTINCT m.id)
        FROM
            Message m
        WHERE
            m.id IN (
                SELECT DISTINCT
                    m.id
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
                (
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
                )
            )
    """
    )
    fun countByQuery(
        @Param("q") q: String,
    ): Long
}
