package dev.zrdzn.finance.backend.storage.infrastructure

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "storage")
data class S3StorageConfiguration(
    val accessKey: String,
    val secretKey: String,
    val region: String,
    val endpoint: String,
    val predefinedBuckets: List<String>
)