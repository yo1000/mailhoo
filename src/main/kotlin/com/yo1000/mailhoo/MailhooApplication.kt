package com.yo1000.mailhoo

import com.yo1000.mailhoo.infrastructure.TableNameStrategy
import org.hibernate.internal.log.`ConnectionAccessLogger_$logger`
import org.springframework.boot.autoconfigure.AutoConfigureBefore
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.FluentQuery
import org.springframework.data.repository.query.QueryByExampleExecutor
import org.springframework.nativex.hint.NativeHint
import org.springframework.nativex.hint.TypeAccess
import org.springframework.nativex.hint.TypeHint
import java.util.*

@NativeHint(options = [
	"-H:+AddAllCharsets",
	"-H:IncludeResources=META-INF/mailcap",
	"-H:IncludeResources=META-INF/mailcap.default",
	"-H:IncludeResources=META-INF/mimetypes.default",
	"-H:IncludeResources=META-INF/javamail.default.address.map",
	"-H:IncludeResources=META-INF/javamail.charset.map",
	"-H:IncludeResources=META-INF/javamail.default.providers",
	"-H:IncludeResources=META-INF/services/javax.mail.Provider",
	"-H:ReflectionConfigurationFiles=classes/reflectconfig.json",
])
@TypeHint(
	types = [
		JpaRepository::class,
		PagingAndSortingRepository::class,
		CrudRepository::class,
		Repository::class,
		QueryByExampleExecutor::class,
		Optional::class,
		FluentQuery::class,
		FluentQuery.FetchableFluentQuery::class,
		`ConnectionAccessLogger_$logger`::class,
	],
	access = [TypeAccess.QUERY_PUBLIC_METHODS]
)
@SpringBootApplication
@EnableJpaRepositories
class MailhooApplication

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
		var port: Int? = null
	)

	data class Web(
		var allowedOrigins: List<String>? = null,
	)

	data class Data(
		var jpa: Jpa? = null
	) {
		data class Jpa(
			var tableNamePrefix: String? = null
		)
	}
}

fun main(args: Array<String>) {
	runApplication<MailhooApplication>(*args)
}
