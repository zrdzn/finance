package dev.zrdzn.finance.backend.common

import org.springframework.boot.SpringApplication
import org.springframework.boot.runApplication
import org.springframework.context.ConfigurableApplicationContext

fun main(args: Array<String>) {
    runApplication<FinanceApplication>(*args)
}

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

    application.setDefaultProperties(properties)

    return application.run()
}