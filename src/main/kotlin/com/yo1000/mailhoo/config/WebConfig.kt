package com.yo1000.mailhoo.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 *
 * @author yo1000
 */
@Configuration
@EnableConfigurationProperties(WebConfigurationProperties::class)
class WebConfig(
    private val props: WebConfigurationProperties
) {
    @Bean
    fun corsConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                props.allowedOrigins?.takeIf { it.isNotEmpty() }?.let {
                    registry
                        .addMapping("/**")
                        .allowedOrigins(*it.toTypedArray())
                        .allowedMethods(
                            HttpMethod.GET.name(),
                            HttpMethod.POST.name(),
                            HttpMethod.PUT.name(),
                            HttpMethod.PATCH.name(),
                            HttpMethod.DELETE.name())
                }
            }
        }
    }
}

@ConfigurationProperties(prefix = "mailhoo.web")
class WebConfigurationProperties(
    var allowedOrigins: List<String>?
)
