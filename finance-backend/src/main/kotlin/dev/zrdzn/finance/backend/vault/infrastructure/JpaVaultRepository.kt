package dev.zrdzn.finance.backend.vault.infrastructure

import dev.zrdzn.finance.backend.vault.Vault
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaVaultRepository : VaultRepository, Repository<Vault, VaultId>