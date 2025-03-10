package dev.zrdzn.finance.backend.vault

import org.springframework.data.repository.Repository

interface VaultInvitationRepository : Repository<VaultInvitation, Int> {

    fun save(vaultInvitation: VaultInvitation): VaultInvitation

    fun findById(vaultInvitationId: Int): VaultInvitation?

    fun findByVaultId(vaultId: Int): Set<VaultInvitation>

    fun findByUserEmail(userEmail: String): Set<VaultInvitation>

    fun deleteByVaultIdAndUserEmail(vaultId: Int, userEmail: String)

}