package dev.zrdzn.finance.backend.common.vault.infrastructure

import dev.zrdzn.finance.backend.common.vault.Vault
import dev.zrdzn.finance.backend.common.vault.VaultId
import dev.zrdzn.finance.backend.common.vault.VaultRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaVaultRepository : VaultRepository, Repository<Vault, VaultId>