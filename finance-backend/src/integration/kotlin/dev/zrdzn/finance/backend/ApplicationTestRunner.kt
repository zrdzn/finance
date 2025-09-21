package dev.zrdzn.finance.backend

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.databind.json.JsonMapper
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinFeature
import com.fasterxml.jackson.module.kotlin.KotlinModule
import dev.zrdzn.finance.backend.configuration.ApplicationConfiguration
import java.math.BigDecimal
import kong.unirest.core.HttpResponse
import kong.unirest.core.Unirest
import kong.unirest.modules.jackson.JacksonObjectMapper
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.slf4j.LoggerFactory
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.http.HttpStatus
import org.testcontainers.containers.GenericContainer
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@Testcontainers
open class ApplicationTestRunner {

    private val logger = LoggerFactory.getLogger(ApplicationTestRunner::class.java)
    private val port = 8090

    protected lateinit var application: ConfigurableApplicationContext

    @Container
    val postgresContainer = PostgreSQLContainer("postgres")

    @Container
    val mailhogContainer = GenericContainer("mailhog/mailhog")
        .withExposedPorts(1025, 8025)

    @Container
    val s3Container = GenericContainer("localstack/localstack")
        .withExposedPorts(4566)
        .withEnv("SERVICES", "s3")
        .withEnv("DEFAULT_REGION", "us-east-1")
        .withEnv("AWS_ACCESS_KEY_ID", "test")
        .withEnv("AWS_SECRET_ACCESS_KEY", "test")

    @BeforeAll
    fun beforeAll() {
        postgresContainer.start()
        mailhogContainer.start()
        s3Container.start()
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
            .defaultBaseUrl("http://localhost:$port/v1")

        application = FinanceLauncher().launchApplication(
            ApplicationConfiguration(
                serverPort = port,
                clientUrl = "http://localhost:3000",
                apiUrl = "http://localhost:$port",
                databaseUrl = postgresContainer.jdbcUrl,
                databaseUsername = postgresContainer.username,
                databasePassword = postgresContainer.password,
                mailHost = mailhogContainer.host,
                mailPort = mailhogContainer.getMappedPort(1025),
                mailUsername = "",
                mailPassword = "",
                mailFrom = "test@financeapp.com",
                mailAuth = false,
                mailStarttls = false,
                storageAccessKey = s3Container.envMap["AWS_ACCESS_KEY_ID"]!!,
                storageSecretKey = s3Container.envMap["AWS_SECRET_ACCESS_KEY"]!!,
                storageRegion = s3Container.envMap["DEFAULT_REGION"]!!,
                storageEndpoint = "http://${s3Container.host}:${s3Container.getMappedPort(4566)}",
                openAiApiKey = "",
                oauthClientIdGoogle = "",
                oauthClientSecretGoogle = "",
                oauthClientRedirectUriGoogle = ""
            )
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
        mailhogContainer.stop()
        s3Container.stop()
    }

    protected fun HttpResponse<String>.containsError(status: HttpStatus) = this.body.contains(status.value().toString())

    protected fun getPricesDifference(expected: BigDecimal, actual: BigDecimal) = expected.compareTo(actual)

}