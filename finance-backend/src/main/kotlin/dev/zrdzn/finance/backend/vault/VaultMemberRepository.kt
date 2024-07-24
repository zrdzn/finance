package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.user.UserId

interface VaultMemberRepository {

    fun save(vaultMember: VaultMember): VaultMember

    fun findByVaultId(vaultId: VaultId): Set<VaultMember>

    fun deleteByVaultIdAndUserId(vaultId: VaultId, userId: UserId)

    fun findVaultsByUserId(userId: UserId): Set<Vault>

}