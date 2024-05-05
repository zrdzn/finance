package dev.zrdzn.finance.backend.common.vault.infrastructure

import dev.zrdzn.finance.backend.api.vault.VaultCreateRequest
import dev.zrdzn.finance.backend.api.vault.VaultCreateResponse
import dev.zrdzn.finance.backend.api.vault.VaultListResponse
import dev.zrdzn.finance.backend.api.vault.VaultResponse
import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.vault.VaultPublicId
import dev.zrdzn.finance.backend.common.vault.VaultService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/vaults")
class VaultController(
    private val vaultService: VaultService
) {

    @PostMapping("/create")
    fun createVault(
        @AuthenticationPrincipal userId: UserId,
        @RequestBody vaultCreateRequest: VaultCreateRequest
    ): VaultCreateResponse =
        vaultService
            .createVault(
                ownerId = userId,
                name = vaultCreateRequest.name
            )

    @GetMapping
    fun getVaults(
        @AuthenticationPrincipal userId: UserId
    ): VaultListResponse = vaultService.getVaultsByOwnerId(userId)

    @GetMapping("/{publicId}")
    fun getVaultByPublicId(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable publicId: VaultPublicId
    ): ResponseEntity<VaultResponse> =
        vaultService.getVaultByPublicId(userId, publicId)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

}