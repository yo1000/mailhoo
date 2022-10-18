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
interface MessageRepositoryForReceivedBccDomain : JpaRepository<Message, String>, MessageRepositoryBase {
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
            a.domain = :param
    """
    )
    override fun findAllByParam(
        @Param("param") param: String,
        pageable: Pageable
    ): Page<Message>

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
            a.domain = :param
        AND
            m.seq >= :seqGte
        AND
            m.seq < :seqLt
    """
    )
    override fun findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(
        @Param("param") param: String,
        @Param("seqGte") seqGte: Long,
        @Param("seqLt") seqLt: Long
    ): List<Message>

    @Query(
        """
        SELECT
            MAX(m.seq)
        FROM
            Message m
        INNER JOIN 
            m.receivedBcc b
        INNER JOIN 
            b.address a
        WHERE
            a.domain = :param
        AND
            m.seq < :seqLt
    """
    )
    override fun maxSeqByParamAndSeqLessThan(
        @Param("param") param: String,
        @Param("seqLt") seqLt: Long
    ): Long?

    @Query(
        """
        SELECT
            MIN(m.seq)
        FROM
            Message m
        INNER JOIN 
            m.receivedBcc b
        INNER JOIN 
            b.address a
        WHERE
            a.domain = :param
        AND
            m.seq >= :seqGte
    """
    )
    override fun minSeqByParamAndSeqGreaterThanEquals(
        @Param("param") param: String,
        @Param("seqGte") seqGte: Long,
    ): Long?

    @Query(
        """
        SELECT
            MAX(m.seq)
        FROM
            Message m
        INNER JOIN 
            m.receivedBcc b
        INNER JOIN 
            b.address a
        WHERE
            a.domain = :param
    """
    )
    override fun maxSeqByParam(
        @Param("param") param: String,
    ): Long?

    @Query(
        """
        SELECT
            MIN(m.seq)
        FROM
            Message m
        INNER JOIN 
            m.receivedBcc b
        INNER JOIN 
            b.address a
        WHERE
            a.domain = :param
    """
    )
    override fun minSeqByParam(
        @Param("param") param: String,
    ): Long?

    @Query(
        """
        SELECT
            COUNT(DISTINCT m.id)
        FROM
            Message m
        INNER JOIN 
            m.receivedBcc b
        INNER JOIN 
            b.address a
        WHERE
            a.domain = :param
    """
    )
    override fun countByParam(
        @Param("param") param: String,
    ): Long
}
