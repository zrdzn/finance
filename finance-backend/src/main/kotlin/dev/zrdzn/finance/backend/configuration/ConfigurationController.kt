package dev.zrdzn.finance.backend.configuration

import dev.zrdzn.finance.backend.ai.AiClient
import dev.zrdzn.finance.backend.ai.impl.GptAiClient
import dev.zrdzn.finance.backend.configuration.dto.ConfigurationResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/config")
class ConfigurationController(
    private val aiClient: AiClient
) {

    @GetMapping
    fun getConfiguration(): ConfigurationResponse =
        ConfigurationResponse(
            aiEnabled = aiClient is GptAiClient
        )

}