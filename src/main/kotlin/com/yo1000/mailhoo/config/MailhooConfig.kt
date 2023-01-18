package com.yo1000.mailhoo.config

import com.yo1000.mailhoo.infrastructure.TableNameStrategy
import org.springframework.boot.autoconfigure.AutoConfigureBefore
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@AutoConfigureBefore(HibernateJpaAutoConfiguration::class)
@EnableConfigurationProperties(MailhooConfigurationProperties::class)
class MailhooConfig {
	@Bean
	fun tableNameStrategy(
		mailhooProps: MailhooConfigurationProperties
	): TableNameStrategy {
		return TableNameStrategy(mailhooProps.data?.jpa?.tableNamePrefix ?: "")
	}
}

@ConfigurationProperties(prefix = "mailhoo")
data class MailhooConfigurationProperties(
	var smtp: Smtp? = null,
	var web: Web? = null,
	var data: Data? = null,
) {
	data class Smtp(
		var port: Int? = null,
	)

	data class Web(
		var allowedOrigins: List<String>? = null,
	)

	data class Data(
		var jpa: Jpa? = null,
	) {
		data class Jpa(
			var tableNamePrefix: String? = null,
		)
	}
}