package com.yo1000.mailhoo

import org.hibernate.internal.log.`ConnectionAccessLogger_$logger`
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
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

fun main(args: Array<String>) {
	runApplication<MailhooApplication>(*args)
}
