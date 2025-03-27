package dev.zrdzn.finance.backend

import dev.zrdzn.finance.backend.configuration.ApplicationConfiguration
import dev.zrdzn.finance.backend.configuration.toConfigurationMap
import org.springframework.boot.SpringApplication
import org.springframework.context.ConfigurableApplicationContext

fun main(args: Array<String>) {
    FinanceLauncher().launchApplication(
        ApplicationConfiguration(
            serverPort = System.getenv("SERVER_PORT")?.toInt()!!,
            clientUrl = System.getenv("CLIENT_URL")!!,
            databaseUrl = System.getenv("DATABASE_URL")!!,
            databaseUsername = System.getenv("DATABASE_USERNAME")!!,
            databasePassword = System.getenv("DATABASE_PASSWORD")!!,
            mailHost = System.getenv("MAIL_HOST")!!,
            mailPort = System.getenv("MAIL_PORT")?.toInt()!!,
            mailUsername = System.getenv("MAIL_USERNAME")!!,
            mailPassword = System.getenv("MAIL_PASSWORD")!!,
            mailFrom = System.getenv("MAIL_FROM")!!,
            storageAccessKey = System.getenv("STORAGE_ACCESS_KEY")!!,
            storageSecretKey = System.getenv("STORAGE_SECRET_KEY")!!,
            storageRegion = System.getenv("STORAGE_REGION")!!,
            storageEndpoint = System.getenv("STORAGE_ENDPOINT")!!,
            openAiApiKey = System.getenv("OPENAI_API_KEY")!!,
            oauthClientIdGoogle = System.getenv("OAUTH_CLIENT_ID_GOOGLE")!!,
            oauthClientSecretGoogle = System.getenv("OAUTH_CLIENT_SECRET_GOOGLE")!!,
            oauthClientRedirectUriGoogle = System.getenv("OAUTH_CLIENT_REDIRECT_URI_GOOGLE")!!,
            docsSwaggerPath = System.getenv("DOCS_SWAGGER_PATH")!!,
            docsOpenApiPath = System.getenv("DOCS_OPENAPI_PATH")!!
        )
    )
}

class FinanceLauncher {

    fun launchApplication(configuration: ApplicationConfiguration): ConfigurableApplicationContext {
        val application = SpringApplication(FinanceApplication::class.java)

        val properties = configuration.toConfigurationMap()

        application.setDefaultProperties(properties)

        return application.run()
    }

}
