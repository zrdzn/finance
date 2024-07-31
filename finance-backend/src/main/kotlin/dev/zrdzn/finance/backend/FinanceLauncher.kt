package dev.zrdzn.finance.backend

import org.slf4j.LoggerFactory
import org.springframework.boot.SpringApplication
import org.springframework.context.ConfigurableApplicationContext

fun main(args: Array<String>) {
    val serverPort = System.getenv("SERVER_PORT")?.toInt() ?: 8080
    val databaseUrl = System.getenv("DATABASE_URL") ?: "jdbc:postgresql://localhost:5432/finance"
    val databaseUsername = System.getenv("DATABASE_USERNAME") ?: "finance"
    val databasePassword = System.getenv("DATABASE_PASSWORD") ?: "finance"

    FinanceLauncher().launchApplication(serverPort, databaseUrl, databaseUsername, databasePassword)
}

class FinanceLauncher {
    private val logger = LoggerFactory.getLogger(FinanceLauncher::class.java)

    fun launchApplication(
        serverPort: Int,
        databaseUrl: String,
        databaseUsername: String,
        databasePassword: String
    ): ConfigurableApplicationContext {
        val application = SpringApplication(FinanceApplication::class.java)

        val properties = mapOf<String, Any>(
            EnvironmentProperty.SERVER_PORT.name to serverPort,
            EnvironmentProperty.DATABASE_URL.name to databaseUrl,
            EnvironmentProperty.DATABASE_USERNAME.name to databaseUsername,
            EnvironmentProperty.DATABASE_PASSWORD.name to databasePassword
        )

        properties.forEach { logger.info("Setting property ${it.key} -> ${it.value}") }

        application.setDefaultProperties(properties)

        return application.run()
    }
}