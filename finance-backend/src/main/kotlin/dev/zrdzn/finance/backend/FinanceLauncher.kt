package dev.zrdzn.finance.backend

import org.slf4j.LoggerFactory
import org.springframework.boot.SpringApplication
import org.springframework.context.ConfigurableApplicationContext

fun main(args: Array<String>) {
    val serverPort = System.getenv("SERVER_PORT")?.toInt() ?: 8080
    val clientUrl = System.getenv("CLIENT_URL") ?: "http://localhost:3000"
    val databaseUrl = System.getenv("DATABASE_URL")!!
    val databaseUsername = System.getenv("DATABASE_USERNAME")!!
    val databasePassword = System.getenv("DATABASE_PASSWORD")!!
    val mailHost = System.getenv("MAIL_HOST") ?: "smtp.gmail.com"
    val mailPort = System.getenv("MAIL_PORT")?.toInt() ?: 587
    val mailUsername = System.getenv("MAIL_USERNAME") ?: ""
    val mailPassword = System.getenv("MAIL_PASSWORD") ?: ""
    val mailFrom = System.getenv("MAIL_FROM") ?: "tester@test.com"

    FinanceLauncher().launchApplication(
        serverPort = serverPort,
        clientUrl = clientUrl,
        databaseUrl = databaseUrl,
        databaseUsername = databaseUsername,
        databasePassword = databasePassword,
        mailHost = mailHost,
        mailPort = mailPort,
        mailUsername = mailUsername,
        mailPassword = mailPassword,
        mailFrom = mailFrom
    )
}

class FinanceLauncher {
    private val logger = LoggerFactory.getLogger(FinanceLauncher::class.java)

    fun launchApplication(
        serverPort: Int,
        clientUrl: String,
        databaseUrl: String,
        databaseUsername: String,
        databasePassword: String,
        mailHost: String,
        mailPort: Int,
        mailUsername: String,
        mailPassword: String,
        mailFrom: String
    ): ConfigurableApplicationContext {
        val application = SpringApplication(FinanceApplication::class.java)

        val properties = mapOf<String, Any>(
            EnvironmentProperty.SERVER_PORT.name to serverPort,
            EnvironmentProperty.CLIENT_URL.name to clientUrl,
            EnvironmentProperty.DATABASE_URL.name to databaseUrl,
            EnvironmentProperty.DATABASE_USERNAME.name to databaseUsername,
            EnvironmentProperty.DATABASE_PASSWORD.name to databasePassword,
            EnvironmentProperty.MAIL_HOST.name to mailHost,
            EnvironmentProperty.MAIL_PORT.name to mailPort,
            EnvironmentProperty.MAIL_USERNAME.name to mailUsername,
            EnvironmentProperty.MAIL_PASSWORD.name to mailPassword,
            EnvironmentProperty.MAIL_FROM.name to mailFrom
        )

        properties.forEach { logger.info("Setting property ${it.key} -> ${it.value}") }

        application.setDefaultProperties(properties)

        return application.run()
    }
}
