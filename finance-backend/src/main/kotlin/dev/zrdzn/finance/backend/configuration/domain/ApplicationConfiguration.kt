package dev.zrdzn.finance.backend.configuration.domain

import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

@Target(AnnotationTarget.PROPERTY)
@Retention(AnnotationRetention.RUNTIME)
annotation class Environment(val key: String)

data class ApplicationConfiguration(
    @Environment("SERVER_PORT") val serverPort: Int,
    @Environment("CLIENT_URL") val clientUrl: String,
    @Environment("DATABASE_URL") val databaseUrl: String,
    @Environment("DATABASE_USERNAME") val databaseUsername: String,
    @Environment("DATABASE_PASSWORD") val databasePassword: String,
    @Environment("MAIL_HOST") val mailHost: String,
    @Environment("MAIL_PORT") val mailPort: Int,
    @Environment("MAIL_USERNAME") val mailUsername: String,
    @Environment("MAIL_PASSWORD") val mailPassword: String,
    @Environment("MAIL_FROM") val mailFrom: String,
    @Environment("STORAGE_ACCESS_KEY") val storageAccessKey: String,
    @Environment("STORAGE_SECRET_KEY") val storageSecretKey: String,
    @Environment("STORAGE_REGION") val storageRegion: String,
    @Environment("STORAGE_ENDPOINT") val storageEndpoint: String,
    @Environment("OPENAI_API_KEY") val openAiApiKey: String
)

inline fun <reified CONFIGURATION : Any> CONFIGURATION.toMap(): Map<String, Any?> =
    CONFIGURATION::class.memberProperties.associate {
        val key = it.findAnnotation<Environment>()?.key ?: it.name
        key to it.get(this)
    }