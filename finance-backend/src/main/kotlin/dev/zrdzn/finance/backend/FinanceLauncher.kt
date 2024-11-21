package dev.zrdzn.finance.backend

import org.slf4j.LoggerFactory
import org.springframework.boot.SpringApplication
import org.springframework.context.ConfigurableApplicationContext

fun main(args: Array<String>) {
    val serverPort = System.getenv("SERVER_PORT")?.toInt()!!
    val clientUrl = System.getenv("CLIENT_URL")!!
    val databaseUrl = System.getenv("DATABASE_URL")!!
    val databaseUsername = System.getenv("DATABASE_USERNAME")!!
    val databasePassword = System.getenv("DATABASE_PASSWORD")!!
    val mailHost = System.getenv("MAIL_HOST")!!
    val mailPort = System.getenv("MAIL_PORT")?.toInt()!!
    val mailUsername = System.getenv("MAIL_USERNAME")!!
    val mailPassword = System.getenv("MAIL_PASSWORD")!!
    val mailFrom = System.getenv("MAIL_FROM")!!
    val storageAccessKey = System.getenv("STORAGE_ACCESS_KEY")!!
    val storageSecretKey = System.getenv("STORAGE_SECRET_KEY")!!
    val storageRegion = System.getenv("STORAGE_REGION")!!
    val storageEndpoint = System.getenv("STORAGE_ENDPOINT")!!

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
        mailFrom = mailFrom,
        storageAccessKey = storageAccessKey,
        storageSecretKey = storageSecretKey,
        storageRegion = storageRegion,
        storageEndpoint = storageEndpoint,
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
        mailFrom: String,
        storageAccessKey: String,
        storageSecretKey: String,
        storageRegion: String,
        storageEndpoint: String,
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
            EnvironmentProperty.MAIL_FROM.name to mailFrom,
            EnvironmentProperty.STORAGE_ACCESS_KEY.name to storageAccessKey,
            EnvironmentProperty.STORAGE_SECRET_KEY.name to storageSecretKey,
            EnvironmentProperty.STORAGE_REGION.name to storageRegion,
            EnvironmentProperty.STORAGE_ENDPOINT.name to storageEndpoint,
        )

        properties.forEach { logger.info("Setting property ${it.key} -> ${it.value}") }

        application.setDefaultProperties(properties)

        return application.run()
    }
}
