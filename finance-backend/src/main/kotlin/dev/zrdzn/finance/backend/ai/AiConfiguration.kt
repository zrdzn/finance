package dev.zrdzn.finance.backend.ai

import dev.zrdzn.finance.backend.ai.impl.FakeAiClient
import dev.zrdzn.finance.backend.ai.impl.GptAiClient
import io.github.sashirestela.openai.SimpleOpenAI
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class AiConfiguration(
    @Value("\${ai.api-key}") private val aiApiKey: String
) {

    private val logger = LoggerFactory.getLogger(AiConfiguration::class.java)

    @Bean
    fun aiClient(): AiClient {
        return if (aiApiKey.isNotEmpty()) {
            logger.info("Creating GPT-4o AI client")

            val openAi = SimpleOpenAI.builder()
                .apiKey(aiApiKey)
                .build()

            GptAiClient(openAi)
        } else {
            logger.info("Creating fake AI client")
            FakeAiClient()
        }
    }

}