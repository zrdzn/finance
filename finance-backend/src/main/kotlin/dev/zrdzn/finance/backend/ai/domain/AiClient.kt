package dev.zrdzn.finance.backend.ai.domain

interface AiClient {

    fun sendRequest(prompt: String, base64Image: String? = null): AiResponse

}