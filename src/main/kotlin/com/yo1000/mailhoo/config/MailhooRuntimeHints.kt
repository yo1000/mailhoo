package com.yo1000.mailhoo.config

import com.sun.mail.handlers.*
import org.postgresql.util.PGobject
import org.springframework.aot.hint.MemberCategory
import org.springframework.aot.hint.RuntimeHints
import org.springframework.aot.hint.RuntimeHintsRegistrar
import org.springframework.aot.hint.TypeReference
import org.springframework.data.domain.Sort


class MailhooRuntimeHints : RuntimeHintsRegistrar {
    override fun registerHints(hints: RuntimeHints, classLoader: ClassLoader?) {
        hints.resources()
            // jakarta.mail-2.*
            .registerPattern("META-INF/services/jakarta.mail.Provider")
            .registerPattern("META-INF/javamail.charset.map")
            .registerPattern("META-INF/javamail.default.address.map")
            .registerPattern("META-INF/javamail.default.providers")
            .registerPattern("META-INF/mailcap")
            // jakarta.activation-api-2.*
            // jakarta.activation-2.*
            .registerPattern("META-INF/mailcap.default")
            .registerPattern("META-INF/mimetypes.default")

        hints.reflection().registerTypes(TypeReference.listOf(
            // jakarta.mail-2.*
            handler_base::class.java,
            image_gif::class.java,
            image_jpeg::class.java,
            message_rfc822::class.java,
            multipart_mixed::class.java,
            text_html::class.java,
            text_plain::class.java,
            text_xml::class.java,
            // spring-data-commons-3.*
            Sort.Order::class.java,
            // postgresql
            PGobject::class.java,
        )) { typeHint ->
            typeHint.withMembers(
                MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS,
                MemberCategory.INVOKE_DECLARED_CONSTRUCTORS,
                MemberCategory.INTROSPECT_PUBLIC_CONSTRUCTORS,
                MemberCategory.INTROSPECT_DECLARED_CONSTRUCTORS,
                MemberCategory.INVOKE_PUBLIC_METHODS,
                MemberCategory.INVOKE_DECLARED_METHODS,
                MemberCategory.INTROSPECT_PUBLIC_METHODS,
                MemberCategory.INTROSPECT_DECLARED_METHODS,
            )
        }
    }
}
