package dev.zrdzn.finance.backend

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.databind.json.JsonMapper
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinFeature
import com.fasterxml.jackson.module.kotlin.KotlinModule
import kong.unirest.core.Unirest
import kong.unirest.jackson.JacksonObjectMapper
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.TestInstance
import org.slf4j.LoggerFactory
import org.springframework.context.ConfigurableApplicationContext
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@Testcontainers
open class ApplicationTestRunner {

    private val logger = LoggerFactory.getLogger(dev.zrdzn.finance.backend.ApplicationTestRunner::class.java)
    private val port = 8090

    protected lateinit var application: ConfigurableApplicationContext

    @Container
    val postgresContainer = PostgreSQLContainer("postgres")

    @BeforeAll
    fun beforeAll() {
        postgresContainer.start()
        logger.info("Postgres container started with port ${postgresContainer.firstMappedPort}")
    }

    @BeforeEach
    fun beforeEach() {
        Unirest.config()
            .setObjectMapper(
                JacksonObjectMapper(
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
                )
            )
            .defaultBaseUrl("http://localhost:$port/api")

        application = dev.zrdzn.finance.backend.launchApplication(
            serverPort = port,
            databaseUrl = postgresContainer.jdbcUrl,
            databaseUsername = postgresContainer.username,
            databasePassword = postgresContainer.password
        )
    }

    @AfterEach
    fun afterEach() {
        Unirest.shutDown()
        application.close()
    }

    @AfterAll
    fun afterAll() {
        postgresContainer.stop()
    }

}