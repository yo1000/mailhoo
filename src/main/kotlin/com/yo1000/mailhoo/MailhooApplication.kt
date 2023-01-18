package com.yo1000.mailhoo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories


@SpringBootApplication
@EnableJpaRepositories
class MailhooApplication

fun main(args: Array<String>) {
	runApplication<MailhooApplication>(*args)
}
