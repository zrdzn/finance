package dev.zrdzn.finance.backend.common.vault.infrastructure

import dev.zrdzn.finance.backend.common.vault.VaultInvitation
import dev.zrdzn.finance.backend.common.vault.VaultInvitationId
import dev.zrdzn.finance.backend.common.vault.VaultInvitationRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaVaultInvitationRepository : VaultInvitationRepository, Repository<VaultInvitation, VaultInvitationId>