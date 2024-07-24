package dev.zrdzn.finance.backend.common.vault

interface VaultInvitationRepository {

    fun save(vaultInvitation: VaultInvitation): VaultInvitation

    fun findById(vaultInvitationId: VaultInvitationId): VaultInvitation?

    fun findByVaultId(vaultId: VaultId): Set<VaultInvitation>

    fun findByUserEmail(userEmail: String): Set<VaultInvitation>

    fun deleteByVaultIdAndUserEmail(vaultId: VaultId, userEmail: String)

}