package com.yo1000.mailhoo.presentation

import com.yo1000.mailhoo.domain.ReceivedBccRepository
import com.yo1000.mailhoo.domain.ReceivedCcRepository
import com.yo1000.mailhoo.domain.ReceivedToRepository
import com.yo1000.mailhoo.domain.SentFromRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 *
 * @author yo1000
 */
@RestController
@RequestMapping("/domains")
class DomainRestController(
    private val sentFromRepos: SentFromRepository,
    private val receivedToRepos: ReceivedToRepository,
    private val receivedCcRepos: ReceivedCcRepository,
    private val receivedBccRepos: ReceivedBccRepository,

) {
    @GetMapping("/from")
    fun getSenderDomains(): List<String> {
        return sentFromRepos.findAll()
            .map { it.address.domain }
            .distinct()
    }

    @GetMapping("/to")
    fun getToDomains(): List<String> {
        return receivedToRepos.findAll()
            .map { it.address.domain }
            .distinct()
    }

    @GetMapping("/cc")
    fun getCcDomains(): List<String> {
        return receivedCcRepos.findAll()
            .map { it.address.domain }
            .distinct()
    }

    @GetMapping("/bcc")
    fun getBccDomains(): List<String> {
        return receivedBccRepos.findAll()
            .map { it.address.domain }
            .distinct()
    }
}
