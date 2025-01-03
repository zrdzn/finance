package dev.zrdzn.finance.backend.vault.infrastructure

import dev.zrdzn.finance.backend.vault.domain.VaultInvitation
import dev.zrdzn.finance.backend.vault.domain.VaultInvitationRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaVaultInvitationRepository : VaultInvitationRepository, Repository<VaultInvitation, Int>