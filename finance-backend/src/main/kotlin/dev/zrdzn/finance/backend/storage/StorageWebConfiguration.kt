package dev.zrdzn.finance.backend.storage

import dev.zrdzn.finance.backend.storage.impl.S3StorageClient
import java.net.URI
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.CreateBucketRequest

@Configuration
class StorageWebConfiguration(private val s3StorageConfiguration: S3StorageConfiguration) {

    @Bean
    fun storageClient(): StorageClient {
        val s3Client = S3Client.builder()
            .credentialsProvider(
                StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(
                        s3StorageConfiguration.accessKey,
                        s3StorageConfiguration.secretKey,
                    )
                )
            )
            .region(Region.of(s3StorageConfiguration.region))
            .endpointOverride(URI.create(s3StorageConfiguration.endpoint))
            .forcePathStyle(true)
            .build()

        s3StorageConfiguration.predefinedBuckets.forEach {
            try {
                s3Client.createBucket(
                    CreateBucketRequest.builder()
                        .bucket(it)
                        .build()
                )
            } catch (_: Exception) {}
        }

        return S3StorageClient(s3Client)
    }

}