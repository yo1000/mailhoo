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
interface MessageSearchRepositoryForContent : JpaRepository<Message, String>, MessageRepositoryBase {
    @Query(
        """
        SELECT DISTINCT
            m
        FROM
            Message m
        WHERE
            m.plainContent LIKE CONCAT('%', :param, '%')
        OR
            m.htmlContent LIKE CONCAT('%', :param, '%')
    """
    )
    override fun findAllByParam(
        param: String,
        pageable: Pageable
    ): Page<Message>
}
