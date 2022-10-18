package com.yo1000.mailhoo.domain

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

/**
 *
 * @author yo1000
 */
@Repository
interface AddressRepository : JpaRepository<Address, String> {
    @Query("""
        SELECT DISTINCT
            a.domain
        FROM
            SentFrom f
        INNER JOIN 
            f.address a
    """)
    fun findAllFromDomain(): List<String>

    @Query("""
        SELECT DISTINCT
            a.domain
        FROM
            ReceivedTo t
        INNER JOIN 
            t.address a
    """)
    fun findAllToDomain(): List<String>

    @Query("""
        SELECT DISTINCT
            a.domain
        FROM
            ReceivedCc c
        INNER JOIN 
            c.address a
    """)
    fun findAllCcDomain(): List<String>

    @Query("""
        SELECT DISTINCT
            a.domain
        FROM
            ReceivedBcc b
        INNER JOIN 
            b.address a
    """)
    fun findAllBccDomain(): List<String>
}

@Repository
interface SentFromRepository : JpaRepository<SentFrom, String>

@Repository
interface ReceivedToRepository : JpaRepository<ReceivedTo, String>

@Repository
interface ReceivedCcRepository : JpaRepository<ReceivedCc, String>

@Repository
interface ReceivedBccRepository : JpaRepository<ReceivedBcc, String>
