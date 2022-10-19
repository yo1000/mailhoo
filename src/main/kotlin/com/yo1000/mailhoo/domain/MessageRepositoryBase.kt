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
}
