package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.shared.createRandomToken
import dev.zrdzn.finance.backend.transaction.api.TransactionMethod
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.vault.api.VaultListResponse
import dev.zrdzn.finance.backend.vault.api.VaultNotFoundByPublicIdException
import dev.zrdzn.finance.backend.vault.api.VaultNotFoundException
import dev.zrdzn.finance.backend.vault.api.VaultResponse
import dev.zrdzn.finance.backend.vault.api.authority.UserNotMemberException
import dev.zrdzn.finance.backend.vault.api.authority.VaultCannotUpdateMemberException
import dev.zrdzn.finance.backend.vault.api.authority.VaultInsufficientPermissionException
import dev.zrdzn.finance.backend.vault.api.authority.VaultPermission
import dev.zrdzn.finance.backend.vault.api.authority.VaultRole
import dev.zrdzn.finance.backend.vault.api.authority.VaultRoleResponse
import dev.zrdzn.finance.backend.vault.api.invitation.VaultInvitationListResponse
import dev.zrdzn.finance.backend.vault.api.invitation.VaultInvitationNotFoundException
import dev.zrdzn.finance.backend.vault.api.invitation.VaultInvitationNotOwnedException
import dev.zrdzn.finance.backend.vault.api.invitation.VaultInvitationResponse
import dev.zrdzn.finance.backend.vault.api.member.VaultMemberListResponse
import dev.zrdzn.finance.backend.vault.api.member.VaultMemberNotFoundException
import dev.zrdzn.finance.backend.vault.api.member.VaultMemberResponse
import java.time.Clock
import java.time.Instant
import java.time.temporal.ChronoUnit
import org.springframework.transaction.annotation.Transactional

open class VaultService(
    private val vaultRepository: VaultRepository,
    private val vaultMemberRepository: VaultMemberRepository,
    private val vaultInvitationRepository: VaultInvitationRepository,
    private val userService: UserService,
    private val clock: Clock
) {

    @Transactional
    open fun authorizeMember(vaultId: Int, userId: Int, requiredPermission: VaultPermission): VaultMemberResponse {
        val member = vaultMemberRepository.findByVaultIdAndUserId(vaultId, userId)
            ?.let {
                VaultMemberResponse(
                    id = it.id!!,
                    vaultId = vaultId,
                    user = userService.getUser(it.userId),
                    vaultRole = it.vaultRole
                )
            } ?: throw UserNotMemberException()

        when {
            !member.vaultRole.hasPermission(requiredPermission) -> throw VaultInsufficientPermissionException()
        }

        return member
    }

    @Transactional
    open fun createVault(ownerId: Int, name: String, currency: String, defaultTransactionMethod: TransactionMethod): VaultResponse =
        vaultRepository
            .save(
                Vault(
                    id = null,
                    createdAt = Instant.now(clock),
                    publicId = createRandomToken(16),
                    ownerId = ownerId,
                    name = name,
                    currency = currency,
                    transactionMethod = defaultTransactionMethod
                )
            )
            .toResponse()
            .also {
                createVaultMemberForcefully(
                    vaultId = it.id,
                    userId = ownerId,
                    vaultRole = VaultRole.OWNER
                )
            }

    @Transactional
    open fun createVaultMemberForcefully(vaultId: Int, userId: Int, vaultRole: VaultRole) {
        val vault = getVaultForcefully(vaultId)

        vaultMemberRepository
            .save(
                VaultMember(
                    id = null,
                    vaultId = vault.id,
                    userId = userId,
                    vaultRole = vaultRole
                )
            )
    }

    @Transactional
    open fun createVaultInvitation(vaultId: Int, requesterId: Int, userEmail: String): VaultInvitationResponse {
        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_INVITE_CREATE)

        val vault = getVault(vaultId, requesterId)

        val invitation = vaultInvitationRepository
            .save(
                VaultInvitation(
                    id = null,
                    vaultId = vault.id,
                    userEmail = userEmail,
                    expiresAt = Instant.now(clock).plus(1, ChronoUnit.DAYS)
                )
            )

        return invitation.toResponse(vault)
    }

    @Transactional
    open fun updateVault(requesterId: Int, vaultId: Int, name: String, currency: String, transactionMethod: TransactionMethod) {
        val vault = vaultRepository.findById(vaultId) ?: throw VaultNotFoundException()

        authorizeMember(vaultId, requesterId, VaultPermission.SETTINGS_UPDATE)

        vault.name = name
        vault.currency = currency
        vault.transactionMethod = transactionMethod
    }

    @Transactional
    open fun updateVaultMember(requesterId: Int, vaultId: Int, vaultMemberId: Int, vaultRole: VaultRole) {
        val requester = authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_UPDATE)
        val vaultMember = vaultMemberRepository.findById(vaultMemberId) ?: throw VaultMemberNotFoundException()

        // check if the requester has higher role than the user he wants to update
        if (!requester.vaultRole.isHigherThan(vaultMember.vaultRole)) {
            throw VaultCannotUpdateMemberException()
        }

        if (vaultRole.isOwner()) {
            throw VaultCannotUpdateMemberException()
        }

        vaultMember.vaultRole = vaultRole
    }

    @Transactional
    open fun acceptVaultInvitation(requesterId: Int, invitationId: Int) {
        val invitation = vaultInvitationRepository.findById(invitationId) ?: throw VaultInvitationNotFoundException()

        val vault = getVaultForcefully(invitation.vaultId)

        val requester = userService.getUser(requesterId)

        if (requester.email != invitation.userEmail) {
            throw VaultInvitationNotOwnedException()
        }

        createVaultMemberForcefully(
            vaultId = vault.id,
            userId = requesterId,
            vaultRole = VaultRole.MEMBER
        )

        removeVaultInvitationForcefully(vault.id, invitation.userEmail)
    }

    @Transactional(readOnly = true)
    open fun getVaultForcefully(vaultId: Int): VaultResponse {
        return vaultRepository.findById(vaultId)
            ?.toResponse()
            ?: throw VaultNotFoundException()
    }

    @Transactional(readOnly = true)
    open fun getVault(vaultId: Int, requesterId: Int): VaultResponse {
        authorizeMember(vaultId, requesterId, VaultPermission.DETAILS_READ)

        return getVaultForcefully(vaultId)
    }

    @Transactional(readOnly = true)
    open fun getVaultsByVaultMemberUserId(requesterId: Int): VaultListResponse {
        return VaultListResponse(
            vaultMemberRepository.findVaultsByUserId(requesterId)
                .map {
                    authorizeMember(it.id!!, requesterId, VaultPermission.DETAILS_READ)

                    it.toResponse()
                }
                .toSet()
        )
    }

    @Transactional(readOnly = true)
    open fun getVaultForcefully(publicId: String): VaultResponse? {
        return vaultRepository.findByPublicId(publicId)
            ?.toResponse()
    }

    @Transactional(readOnly = true)
    open fun getVault(publicId: String, requesterId: Int): VaultResponse? {
        val vault = getVaultForcefully(publicId) ?: throw VaultNotFoundByPublicIdException()

        authorizeMember(vault.id, requesterId, VaultPermission.DETAILS_READ)

        return vault
    }

    @Transactional(readOnly = true)
    open fun getVaultMembers(vaultId: Int, requesterId: Int): VaultMemberListResponse {
        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_READ)

        return VaultMemberListResponse(
            vaultMemberRepository.findByVaultId(vaultId)
                .map { it.toResponse(userService.getUser(it.userId)) }
                .toSet()
        )
    }

    @Transactional(readOnly = true)
    open fun getVaultInvitations(vaultId: Int, requesterId: Int): VaultInvitationListResponse {
        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_INVITE_READ)

        return VaultInvitationListResponse(
            vaultInvitationRepository.findByVaultId(vaultId)
                .map { it.toResponse(getVault(vaultId = vaultId, requesterId = requesterId)) }
                .toSet()
        )
    }

    @Transactional(readOnly = true)
    open fun getVaultInvitations(requesterId: Int, userEmail: String): VaultInvitationListResponse {
        val requester = userService.getUser(requesterId)

        if (requester.email != userEmail) {
            throw VaultInvitationNotOwnedException()
        }

        return VaultInvitationListResponse(
            vaultInvitationRepository.findByUserEmail(userEmail)
                .map { it.toResponse(getVault(vaultId = it.vaultId, requesterId = requesterId)) }
                .toSet()
        )
    }

    @Transactional(readOnly = true)
    open fun getVaultRole(vaultId: Int, requesterId: Int): VaultRoleResponse {
        return vaultMemberRepository.findByVaultIdAndUserId(vaultId, requesterId)
            ?.vaultRole
            ?.let {
                VaultRoleResponse(
                    name = it.name,
                    weight = it.weight,
                    permissions = it.permissions
                )
            }
            ?: throw UserNotMemberException()
    }

    @Transactional
    open fun removeVault(vaultId: Int, requesterId: Int) {
        authorizeMember(vaultId, requesterId, VaultPermission.DELETE)

        vaultRepository.deleteById(vaultId)
    }

    @Transactional
    open fun removeVaultMember(vaultId: Int, requesterId: Int, userId: Int) =
        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_REMOVE)
            .also { vaultMemberRepository.deleteByVaultIdAndUserId(vaultId, userId) }

    @Transactional
    open fun removeVaultInvitationForcefully(vaultId: Int, userEmail: String) {
        vaultInvitationRepository.deleteByVaultIdAndUserEmail(vaultId, userEmail)
    }

    @Transactional
    open fun removeVaultInvitation(vaultId: Int, requesterId: Int, userEmail: String) {
        val user = userService.getUser(requesterId)
        if (user.email == userEmail) {
            removeVaultInvitationForcefully(vaultId, userEmail)
            return
        }

        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_INVITE_DELETE)
            .also { removeVaultInvitationForcefully(vaultId, userEmail) }
    }

}
