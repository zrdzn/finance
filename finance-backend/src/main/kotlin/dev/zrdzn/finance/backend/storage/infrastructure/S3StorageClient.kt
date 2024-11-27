package dev.zrdzn.finance.backend.storage.infrastructure

import dev.zrdzn.finance.backend.storage.StorageClient
import java.io.InputStream
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import software.amazon.awssdk.services.s3.model.S3Exception

class S3StorageClient(private val s3Client: S3Client) : StorageClient {

    override fun saveFile(bucket: String, key: String, data: InputStream) {
        val temporaryFile = Files.createTempFile(null, null)
        try {
            Files.copy(data, temporaryFile, StandardCopyOption.REPLACE_EXISTING)

            s3Client.putObject(
                PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build(),
                RequestBody.fromFile(temporaryFile)
            )
        } finally {
            Files.delete(temporaryFile)
        }
    }

    override fun loadFile(bucket: String, key: String): InputStream? {
        return try {
            s3Client.getObject(
                GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build()
            )
        } catch (e: S3Exception) {
            // file does not exist
            null
        }
    }

}