package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.user.UserId

interface VaultMemberRepository {

    fun save(vaultMember: VaultMember): VaultMember

    fun findById(vaultMemberId: VaultMemberId): VaultMember?

    fun findByVaultId(vaultId: VaultId): Set<VaultMember>

    fun findByVaultIdAndUserId(vaultId: VaultId, userId: UserId): VaultMember?

    fun findVaultsByUserId(userId: UserId): Set<Vault>

    fun deleteByVaultIdAndUserId(vaultId: VaultId, userId: UserId)

}