package dev.zrdzn.finance.backend.application

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.databind.json.JsonMapper
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinFeature
import com.fasterxml.jackson.module.kotlin.KotlinModule
import java.time.Clock
import kong.unirest.core.Unirest
import kong.unirest.jackson.JacksonObjectMapper
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class FinanceApplicationConfiguration {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder(10)

    @Bean
    fun clock(): Clock = Clock.systemUTC()

    @Bean
    fun objectMapper(): ObjectMapper =
        JsonMapper.builder()
            .addModule(JavaTimeModule())
            .addModule(SimpleModule())
            .addModule(
                KotlinModule.Builder()
                    .withReflectionCacheSize(512)
                    .configure(KotlinFeature.NullToEmptyCollection, false)
                    .configure(KotlinFeature.NullToEmptyMap, false)
                    .configure(KotlinFeature.NullIsSameAsDefault, false)
                    .configure(KotlinFeature.SingletonSupport, false)
                    .configure(KotlinFeature.StrictNullChecks, true)
                    .build()
            )
            .build()
            .setSerializationInclusion(JsonInclude.Include.NON_NULL)
            .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, true)
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .also { Unirest.config().setObjectMapper(JacksonObjectMapper(it)) }

}