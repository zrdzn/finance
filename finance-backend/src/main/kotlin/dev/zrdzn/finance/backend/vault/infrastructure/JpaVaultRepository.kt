package dev.zrdzn.finance.backend.vault.infrastructure

import dev.zrdzn.finance.backend.vault.domain.Vault
import dev.zrdzn.finance.backend.vault.domain.VaultRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaVaultRepository : VaultRepository, Repository<Vault, Int>