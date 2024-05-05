package dev.zrdzn.finance.backend.common.vault

import dev.zrdzn.finance.backend.common.user.UserId

interface VaultRepository {

    fun save(vault: Vault): Vault

    fun findByOwnerId(ownerId: UserId): Set<Vault>

    fun findByPublicId(publicId: VaultPublicId): Vault?

}