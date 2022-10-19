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
interface MessageRepositoryForSentFromDomain : JpaRepository<Message, String>, MessageRepositoryBase {
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
            a.domain = :param
    """
    )
    override fun findAllByParam(
        @Param("param") param: String,
        pageable: Pageable
    ): Page<Message>
}
