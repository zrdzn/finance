package dev.zrdzn.finance.backend.vault.infrastructure

import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultInvitationId
import dev.zrdzn.finance.backend.vault.VaultPublicId
import dev.zrdzn.finance.backend.vault.VaultService
import dev.zrdzn.finance.backend.vault.api.VaultCreateRequest
import dev.zrdzn.finance.backend.vault.api.VaultCreateResponse
import dev.zrdzn.finance.backend.vault.api.VaultInvitationCreateRequest
import dev.zrdzn.finance.backend.vault.api.VaultInvitationListResponse
import dev.zrdzn.finance.backend.vault.api.VaultListResponse
import dev.zrdzn.finance.backend.vault.api.VaultMemberListResponse
import dev.zrdzn.finance.backend.vault.api.VaultResponse
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
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

    @PostMapping("/{vaultId}/invitations")
    fun createVaultInvitation(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId,
        @RequestBody vaultInvitationCreateRequest: VaultInvitationCreateRequest
    ): Unit = vaultService.createVaultInvitation(
        vaultId = vaultId,
        userEmail = vaultInvitationCreateRequest.userEmail
    )

    @PostMapping("/invitations/{invitationId}/accept")
    fun acceptVaultInvitation(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable invitationId: VaultInvitationId
    ): Unit = vaultService.acceptVaultInvitation(invitationId)

    @GetMapping
    fun getVaults(
        @AuthenticationPrincipal userId: UserId
    ): VaultListResponse = vaultService.getVaultsByVaultMemberUserId(userId)

    @GetMapping("/{vaultPublicId}")
    fun getVaultByPublicId(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultPublicId: VaultPublicId
    ): ResponseEntity<VaultResponse> =
        vaultService.getVaultByPublicId(vaultPublicId)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @GetMapping("/{vaultId}/members")
    fun getVaultMembers(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId
    ): VaultMemberListResponse = vaultService.getVaultMembers(vaultId)

    @GetMapping("/{vaultId}/invitations")
    fun getVaultInvitations(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId
    ): VaultInvitationListResponse = vaultService.getVaultInvitations(vaultId)

    @GetMapping("/invitations/{userEmail}")
    fun getVaultInvitation(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable userEmail: String
    ): VaultInvitationListResponse = vaultService.getVaultInvitations(userEmail)

    @DeleteMapping("/{vaultId}/members/{userId}")
    fun removeVaultMember(
        @AuthenticationPrincipal authenticatedUserId: UserId,
        @PathVariable vaultId: VaultId,
        @PathVariable userId: UserId
    ): Unit = vaultService.removeVaultMember(vaultId, userId)

    @DeleteMapping("/{vaultId}/invitations/{userEmail}")
    fun removeVaultInvitation(
        @AuthenticationPrincipal authenticatedUserId: UserId,
        @PathVariable vaultId: VaultId,
        @PathVariable userEmail: String
    ): Unit = vaultService.removeVaultInvitation(
        vaultId = vaultId,
        userEmail = userEmail
    )

}