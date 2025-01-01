package dev.zrdzn.finance.backend.vault.domain

interface VaultInvitationRepository {

    fun save(vaultInvitation: VaultInvitation): VaultInvitation

    fun findById(vaultInvitationId: Int): VaultInvitation?

    fun findByVaultId(vaultId: Int): Set<VaultInvitation>

    fun findByUserEmail(userEmail: String): Set<VaultInvitation>

    fun deleteByVaultIdAndUserEmail(vaultId: Int, userEmail: String)

}