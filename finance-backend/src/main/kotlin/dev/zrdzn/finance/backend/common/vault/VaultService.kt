package dev.zrdzn.finance.backend.common.vault

import dev.zrdzn.finance.backend.api.vault.VaultCreateResponse
import dev.zrdzn.finance.backend.api.vault.VaultListResponse
import dev.zrdzn.finance.backend.api.vault.VaultResponse
import dev.zrdzn.finance.backend.common.shared.createRandomToken
import dev.zrdzn.finance.backend.common.user.UserId
import org.slf4j.LoggerFactory

class VaultService(
    private val vaultRepository: VaultRepository
) {

    private val logger = LoggerFactory.getLogger(VaultService::class.java)

    fun createVault(ownerId: UserId, name: String): VaultCreateResponse =
        vaultRepository
            .save(
                Vault(
                    id = null,
                    publicId = createRandomToken(16),
                    ownerId = ownerId,
                    name = name
                )
            )
            .let {
                VaultCreateResponse(
                    id = it.id!!,
                    publicId = it.publicId
                )
            }
            .also { logger.info("Successfully created new vault: $it") }

    fun getVaultsByOwnerId(ownerId: UserId): VaultListResponse =
        VaultListResponse(
            vaultRepository.findByOwnerId(ownerId)
                .map {
                    VaultResponse(
                        id = it.id!!,
                        publicId = it.publicId,
                        ownerId = it.ownerId,
                        name = it.name
                    )
                }
                .toSet()
        )

    fun getVaultByPublicId(publicId: VaultPublicId): VaultResponse? {
        return vaultRepository.findByPublicId(publicId)
            ?.let {
                VaultResponse(
                    id = it.id!!,
                    publicId = it.publicId,
                    ownerId = it.ownerId,
                    name = it.name
                )
            }
    }

}