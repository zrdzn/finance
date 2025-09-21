package dev.zrdzn.finance.backend.configuration

import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

@Target(AnnotationTarget.PROPERTY)
@Retention(AnnotationRetention.RUNTIME)
annotation class Environment(val key: String, val optional: Boolean = false)

data class ApplicationConfiguration(
    @Environment("SERVER_PORT") val serverPort: Int,
    @Environment("CLIENT_URL") val clientUrl: String,
    @Environment("NEXT_PUBLIC_API_URL") val apiUrl: String,
    @Environment("DATABASE_URL") val databaseUrl: String,
    @Environment("DATABASE_USERNAME") val databaseUsername: String,
    @Environment("DATABASE_PASSWORD") val databasePassword: String,
    @Environment("MAIL_HOST") val mailHost: String,
    @Environment("MAIL_PORT") val mailPort: Int,
    @Environment("MAIL_USERNAME") val mailUsername: String,
    @Environment("MAIL_PASSWORD") val mailPassword: String,
    @Environment("MAIL_FROM") val mailFrom: String,
    @Environment("MAIL_AUTH") val mailAuth: Boolean,
    @Environment("MAIL_STARTTLS") val mailStarttls: Boolean,
    @Environment("STORAGE_ACCESS_KEY") val storageAccessKey: String,
    @Environment("STORAGE_SECRET_KEY") val storageSecretKey: String,
    @Environment("STORAGE_REGION") val storageRegion: String,
    @Environment("STORAGE_ENDPOINT") val storageEndpoint: String,
    @Environment("OPENAI_API_KEY") val openAiApiKey: String,
    @Environment("OAUTH_CLIENT_ID_GOOGLE", optional = true) val oauthClientIdGoogle: String,
    @Environment("OAUTH_CLIENT_SECRET_GOOGLE", optional = true) val oauthClientSecretGoogle: String,
    @Environment("OAUTH_CLIENT_REDIRECT_URI_GOOGLE", optional = true) val oauthClientRedirectUriGoogle: String,
)

inline fun <reified CONFIGURATION : Any> CONFIGURATION.toConfigurationMap(): Map<String, Any?> =
    CONFIGURATION::class.memberProperties
        .mapNotNull {
            val annotation = it.findAnnotation<Environment>()
                ?: throw IllegalArgumentException("Property ${it.name} is missing @Environment annotation")

            val value = it.get(this)

            if (annotation.optional && value.toString().isEmpty()) {
                return@mapNotNull null
            }

            annotation.key to value
        }
        .toMap()