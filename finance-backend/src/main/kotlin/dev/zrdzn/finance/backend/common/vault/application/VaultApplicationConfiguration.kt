package dev.zrdzn.finance.backend.common.vault.application

import dev.zrdzn.finance.backend.common.user.UserService
import dev.zrdzn.finance.backend.common.vault.VaultInvitationRepository
import dev.zrdzn.finance.backend.common.vault.VaultMemberRepository
import dev.zrdzn.finance.backend.common.vault.VaultRepository
import dev.zrdzn.finance.backend.common.vault.VaultService
import java.time.Clock
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class VaultApplicationConfiguration(
    private val vaultRepository: VaultRepository,
    private val vaultMemberRepository: VaultMemberRepository,
    private val vaultInvitationRepository: VaultInvitationRepository,
    private val userService: UserService,
    private val clock: Clock
) {

    @Bean
    fun vaultService(): VaultService = VaultService(
        vaultRepository = vaultRepository,
        vaultMemberRepository = vaultMemberRepository,
        vaultInvitationRepository = vaultInvitationRepository,
        userService = userService,
        clock = clock
    )

}