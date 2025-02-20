package dev.zrdzn.finance.backend.ai.infrastructure

import dev.zrdzn.finance.backend.ai.domain.AiClient
import dev.zrdzn.finance.backend.ai.domain.AiResponse

class FakeAiClient : AiClient {

    override fun sendRequest(prompt: String, base64Image: String?): AiResponse =
        AiResponse(
            response = "This is a fake response from prompt: $prompt"
        )

}