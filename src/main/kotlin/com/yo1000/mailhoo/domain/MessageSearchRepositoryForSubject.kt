package com.yo1000.mailhoo.domain

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

/**
 *
 * @author yo1000
 */
@Repository
interface MessageSearchRepositoryForSubject : JpaRepository<Message, String>, MessageRepositoryBase {
    @Query(
        """
        SELECT DISTINCT
            m
        FROM
            Message m
        WHERE
            m.subject LIKE CONCAT('%', :param, '%')
    """
    )
    override fun findAllByParam(
        param: String,
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
                WHERE
                (
                    m.subject LIKE CONCAT('%', :param, '%')
                )
            )
        AND
            m.seq >= :seqGte
        AND
            m.seq < :seqLt
    """
    )
    override fun findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(
        param: String,
        seqGte: Long,
        seqLt: Long
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
                WHERE
                    m.subject LIKE CONCAT('%', :param, '%')
            )
        AND
            m.seq < :seqLt
    """
    )
    override fun maxSeqByParamAndSeqLessThan(
        param: String,
        seqLt: Long
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
                WHERE
                    m.subject LIKE CONCAT('%', :param, '%')
            )
        AND
            m.seq >= :seqGte
    """
    )
    override fun minSeqByParamAndSeqGreaterThanEquals(
        param: String,
        seqGte: Long
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
                WHERE
                    m.subject LIKE CONCAT('%', :param, '%')
            )
    """
    )
    override fun maxSeqByParam(
        param: String
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
                WHERE
                    m.subject LIKE CONCAT('%', :param, '%')
            )
    """
    )
    override fun minSeqByParam(
        param: String
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
                WHERE
                    m.subject LIKE CONCAT('%', :param, '%')
            )
    """
    )
    override fun countByParam(
        param: String
    ): Long
}
