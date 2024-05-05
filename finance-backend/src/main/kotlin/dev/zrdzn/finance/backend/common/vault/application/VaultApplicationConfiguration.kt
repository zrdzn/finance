package dev.zrdzn.finance.backend.common.vault.application

import dev.zrdzn.finance.backend.common.vault.VaultRepository
import dev.zrdzn.finance.backend.common.vault.VaultService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class VaultApplicationConfiguration(
    private val vaultRepository: VaultRepository
) {

    @Bean
    fun vaultService(): VaultService = VaultService(
        vaultRepository = vaultRepository
    )

}