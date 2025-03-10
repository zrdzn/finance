package dev.zrdzn.finance.backend.ai.impl

import dev.zrdzn.finance.backend.ai.AiClient
import dev.zrdzn.finance.backend.ai.AiResponse

class FakeAiClient : AiClient {

    override fun sendRequest(prompt: String, base64Image: String?): AiResponse =
        AiResponse(
            response = "This is a fake response from prompt: $prompt"
        )

}