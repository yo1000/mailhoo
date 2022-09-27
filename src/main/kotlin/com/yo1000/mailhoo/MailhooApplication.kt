package com.yo1000.mailhoo

import com.sun.mail.handlers.*
import com.sun.mail.smtp.SMTPTransport
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.FluentQuery
import org.springframework.data.repository.query.QueryByExampleExecutor
import org.springframework.nativex.hint.NativeHint
import org.springframework.nativex.hint.TypeAccess
import org.springframework.nativex.hint.TypeHint
import java.util.*
import javax.activation.MailcapCommandMap
import javax.mail.internet.MimeMultipart

@NativeHint(options = ["-H:+AddAllCharsets"])
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
		SMTPTransport::class,
		MimeMultipart::class,
		MailcapCommandMap::class,
		text_html::class,
		multipart_mixed::class,
		handler_base::class,
		image_gif::class,
		image_jpeg::class,
		message_rfc822::class,
		text_xml::class,
		text_plain::class
	],
	access = [TypeAccess.QUERY_PUBLIC_METHODS]
)
@SpringBootApplication
class MailhooApplication

fun main(args: Array<String>) {
	runApplication<MailhooApplication>(*args)
}
