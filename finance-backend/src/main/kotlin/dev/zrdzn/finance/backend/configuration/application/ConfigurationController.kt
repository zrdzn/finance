package dev.zrdzn.finance.backend.configuration.application

import dev.zrdzn.finance.backend.ai.domain.AiClient
import dev.zrdzn.finance.backend.ai.infrastructure.GptAiClient
import dev.zrdzn.finance.backend.configuration.application.response.ConfigurationResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/config")
class ConfigurationController(
    private val aiClient: AiClient
) {

    @GetMapping
    fun getConfiguration(): ConfigurationResponse =
        ConfigurationResponse(
            aiEnabled = aiClient is GptAiClient
        )

}