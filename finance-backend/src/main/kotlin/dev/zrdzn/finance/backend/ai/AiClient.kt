package dev.zrdzn.finance.backend.ai

interface AiClient {

    fun sendRequest(prompt: String, base64Image: String? = null): AiResponse

}