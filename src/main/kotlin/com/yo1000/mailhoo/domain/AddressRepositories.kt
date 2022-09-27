package com.yo1000.mailhoo.domain

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 *
 * @author yo1000
 */
@Repository
interface AddressRepository : JpaRepository<Address, String>

@Repository
interface SentFromRepository : JpaRepository<SentFrom, String>

@Repository
interface ReceivedToRepository : JpaRepository<ReceivedTo, String>

@Repository
interface ReceivedCcRepository : JpaRepository<ReceivedCc, String>

@Repository
interface ReceivedBccRepository : JpaRepository<ReceivedBcc, String>
