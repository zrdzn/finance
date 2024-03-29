package dev.zrdzn.finance.backend.common

import io.restassured.RestAssured
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApplicationTestRunner {

    @LocalServerPort
    protected var port: Int = 8080

    @Autowired
    protected lateinit var restTemplate: TestRestTemplate

    @BeforeEach
    fun beforeEach(): Unit {
        RestAssured.baseURI = "http://localhost:$port/api"
    }

    companion object {

        @JvmStatic
        private var postgresContainer = PostgreSQLContainer("postgres")

        @JvmStatic
        @BeforeAll
        fun beforeAll(): Unit {
            postgresContainer.start()
        }

        @JvmStatic
        @AfterAll
        fun afterAll(): Unit {
            postgresContainer.stop()
        }

        @JvmStatic
        @DynamicPropertySource
        fun configureProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgresContainer::getJdbcUrl)
            registry.add("spring.datasource.username", postgresContainer::getUsername)
            registry.add("spring.datasource.password", postgresContainer::getPassword)
        }

    }

}