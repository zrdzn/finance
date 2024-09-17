package dev.zrdzn.finance.backend.audit.application

import dev.zrdzn.finance.backend.audit.AuditRepository
import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.vault.VaultService
import java.time.Clock
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class AuditApplicationConfiguration(
    private val auditRepository: AuditRepository,
    private val vaultService: VaultService,
    private val clock: Clock
) {

    @Bean
    fun auditService(): AuditService =
        AuditService(
            auditRepository = auditRepository,
            vaultService = vaultService,
            clock = clock
        )

}