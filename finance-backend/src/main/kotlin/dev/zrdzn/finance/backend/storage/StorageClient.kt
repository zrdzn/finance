package dev.zrdzn.finance.backend.storage

import java.io.InputStream

interface StorageClient {

    fun saveFile(bucket: String, key: String, data: InputStream)

    fun loadFile(bucket: String, key: String): InputStream?

}