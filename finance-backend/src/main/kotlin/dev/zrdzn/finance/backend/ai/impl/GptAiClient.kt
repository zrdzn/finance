package dev.zrdzn.finance.backend.ai.impl

import dev.zrdzn.finance.backend.ai.AiClient
import dev.zrdzn.finance.backend.ai.AiResponse
import io.github.sashirestela.openai.SimpleOpenAI
import io.github.sashirestela.openai.common.content.ContentPart.ContentPartImageUrl
import io.github.sashirestela.openai.common.content.ContentPart.ContentPartImageUrl.ImageUrl
import io.github.sashirestela.openai.common.content.ContentPart.ContentPartText
import io.github.sashirestela.openai.common.content.ImageDetail
import io.github.sashirestela.openai.domain.chat.ChatMessage.UserMessage
import io.github.sashirestela.openai.domain.chat.ChatRequest
import org.slf4j.LoggerFactory

class GptAiClient(
    private val simpleOpenAI: SimpleOpenAI
) : AiClient {

    private val logger = LoggerFactory.getLogger(GptAiClient::class.java)

    override fun sendRequest(prompt: String, base64Image: String?): AiResponse {
        val messageParts = mutableListOf<Any>()

        // add main prompt to messages
        messageParts.add(ContentPartText.of(prompt))

        if (base64Image != null) {
            // convert base64 image to image url that api can read
            val url = "data:image/png;base64,$base64Image"
            val imageUrl = ContentPartImageUrl.of(ImageUrl.of(url, ImageDetail.HIGH))

            // add image to messages
            messageParts.add(imageUrl)
        }

        val messages = listOf(
            UserMessage.of(
                messageParts
            )
        )

        val request = ChatRequest.builder()
            .model("gpt-4o")
            .messages(messages)
            .temperature(1.0)
            .presencePenalty(0.0)
            .frequencyPenalty(0.0)
            .topP(1.0)
            .maxCompletionTokens(1000)
            .build()

        logger.info("Sending request to GPT-4o model (prompt: $prompt)")
        val response = simpleOpenAI.chatCompletions().createStream(request).join()
        logger.info("Received response from GPT-4o model (response: $response)")

        val latestResponse = response
            .filter { it.choices.isNotEmpty() && !it.firstContent().isNullOrEmpty() }
            .map { it.firstContent() }
            .toList()
            .joinToString(separator = "")

        logger.info("Returning response to client (response: $latestResponse)")

        return AiResponse(response = latestResponse)
    }

}