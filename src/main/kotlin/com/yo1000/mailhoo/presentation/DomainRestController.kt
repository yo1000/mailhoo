package com.yo1000.mailhoo.presentation

import com.yo1000.mailhoo.domain.AddressRepository
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
    private val addressRepository: AddressRepository
) {
    @GetMapping("/from")
    fun getSenderDomains(): List<String> {
        return addressRepository.findAllFromDomain()
    }

    @GetMapping("/to")
    fun getToDomains(): List<String> {
        return addressRepository.findAllToDomain()
    }

    @GetMapping("/cc")
    fun getCcDomains(): List<String> {
        return addressRepository.findAllCcDomain()
    }

    @GetMapping("/bcc")
    fun getBccDomains(): List<String> {
        return addressRepository.findAllBccDomain()
    }
}
