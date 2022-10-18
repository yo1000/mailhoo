package com.yo1000.mailhoo.domain

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

/**
 *
 * @author yo1000
 */
interface MessageRepositoryBase {
    fun findAllByParam(
        param: String,
        pageable: Pageable
    ): Page<Message>

    fun findAllByParamAndSeqLessThanAndSeqGreaterThanEquals(
        param: String,
        seqGte: Long,
        seqLt: Long
    ): List<Message>

    fun maxSeqByParamAndSeqLessThan(
        param: String,
        seqLt: Long,
    ): Long?

    fun minSeqByParamAndSeqGreaterThanEquals(
        param: String,
        seqGte: Long,
    ): Long?

    fun maxSeqByParam(
        param: String
    ): Long?

    fun minSeqByParam(
        param: String
    ): Long?

    fun countByParam(
        param: String,
    ): Long
}
