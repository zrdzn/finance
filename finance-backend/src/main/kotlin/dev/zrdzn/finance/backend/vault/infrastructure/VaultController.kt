package dev.zrdzn.finance.backend.vault.infrastructure

import dev.zrdzn.finance.backend.vault.VaultService
import dev.zrdzn.finance.backend.vault.api.VaultCreateRequest
import dev.zrdzn.finance.backend.vault.api.VaultListResponse
import dev.zrdzn.finance.backend.vault.api.VaultResponse
import dev.zrdzn.finance.backend.vault.api.VaultUpdateRequest
import dev.zrdzn.finance.backend.vault.api.authority.VaultRoleResponse
import dev.zrdzn.finance.backend.vault.api.invitation.VaultInvitationCreateRequest
import dev.zrdzn.finance.backend.vault.api.invitation.VaultInvitationListResponse
import dev.zrdzn.finance.backend.vault.api.member.VaultMemberListResponse
import dev.zrdzn.finance.backend.vault.api.member.VaultMemberUpdateRequest
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
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
        @AuthenticationPrincipal userId: Int,
        @RequestBody vaultCreateRequest: VaultCreateRequest
    ): VaultResponse =
        vaultService
            .createVault(
                ownerId = userId,
                name = vaultCreateRequest.name,
                currency = vaultCreateRequest.currency,
                defaultTransactionMethod = vaultCreateRequest.transactionMethod
            )

    @PostMapping("/{vaultId}/invitations")
    fun createVaultInvitation(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int,
        @RequestBody vaultInvitationCreateRequest: VaultInvitationCreateRequest
    ): Unit = vaultService.createVaultInvitation(
        vaultId = vaultId,
        requesterId = userId,
        userEmail = vaultInvitationCreateRequest.userEmail
    )

    @PatchMapping("/{vaultId}")
    fun updateVault(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int,
        @RequestBody vaultUpdateRequest: VaultUpdateRequest
    ): Unit =
        vaultService.updateVault(
            vaultId = vaultId,
            requesterId = userId,
            name = vaultUpdateRequest.name,
            currency = vaultUpdateRequest.currency,
            transactionMethod = vaultUpdateRequest.transactionMethod
        )

    @PatchMapping("/{vaultId}/members/{userId}")
    fun updateVaultMember(
        @AuthenticationPrincipal requesterId: Int,
        @PathVariable vaultId: Int,
        @PathVariable userId: Int,
        @RequestBody vaultMemberUpdateRequest: VaultMemberUpdateRequest
    ): Unit = vaultService.updateVaultMember(
        vaultId = vaultId,
        requesterId = requesterId,
        vaultMemberId = userId,
        vaultRole = vaultMemberUpdateRequest.vaultRole
    )

    @PostMapping("/invitations/{invitationId}/accept")
    fun acceptVaultInvitation(
        @AuthenticationPrincipal userId: Int,
        @PathVariable invitationId: Int
    ): Unit = vaultService.acceptVaultInvitation(
        requesterId = userId,
        invitationId = invitationId
    )

    @GetMapping
    fun getVaults(
        @AuthenticationPrincipal userId: Int
    ): VaultListResponse = vaultService.getVaultsByVaultMemberUserId(userId)

    @GetMapping("/{vaultPublicId}")
    fun getVaultByPublicId(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultPublicId: String
    ): ResponseEntity<VaultResponse> =
        vaultService.getVault(vaultPublicId, userId)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @GetMapping("/{vaultId}/members")
    fun getVaultMembers(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int
    ): VaultMemberListResponse = vaultService.getVaultMembers(vaultId, userId)

    @GetMapping("/{vaultId}/invitations")
    fun getVaultInvitations(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int
    ): VaultInvitationListResponse = vaultService.getVaultInvitations(vaultId, userId)

    @GetMapping("/invitations/{userEmail}")
    fun getVaultInvitationsByUserEmail(
        @AuthenticationPrincipal authenticatedUserId: Int,
        @PathVariable userEmail: String
    ): VaultInvitationListResponse = vaultService.getVaultInvitations(
        requesterId = authenticatedUserId,
        userEmail = userEmail
    )

    @GetMapping("/{vaultId}/role")
    fun getVaultRole(
        @AuthenticationPrincipal requesterId: Int,
        @PathVariable vaultId: Int
    ): VaultRoleResponse = vaultService.getVaultRole(
        vaultId = vaultId,
        requesterId = requesterId
    )

    @DeleteMapping("/{vaultId}")
    fun removeVault(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int
    ) {
        vaultService.removeVault(vaultId = vaultId, requesterId = userId)
    }

    @DeleteMapping("/{vaultId}/members/{userId}")
    fun removeVaultMember(
        @AuthenticationPrincipal authenticatedUserId: Int,
        @PathVariable vaultId: Int,
        @PathVariable userId: Int
    ) {
        vaultService.removeVaultMember(
            vaultId = vaultId,
            requesterId = authenticatedUserId,
            userId = userId
        )
    }

    @DeleteMapping("/{vaultId}/invitations/{userEmail}")
    fun removeVaultInvitation(
        @AuthenticationPrincipal authenticatedUserId: Int,
        @PathVariable vaultId: Int,
        @PathVariable userEmail: String
    ) {
        vaultService.removeVaultInvitation(
            vaultId = vaultId,
            requesterId = authenticatedUserId,
            userEmail = userEmail
        )
    }

}
