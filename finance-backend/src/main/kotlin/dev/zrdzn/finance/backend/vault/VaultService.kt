package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.shared.createRandomToken
import dev.zrdzn.finance.backend.transaction.TransactionMethod
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.vault.VaultMapper.toResponse
import dev.zrdzn.finance.backend.vault.error.UserNotMemberError
import dev.zrdzn.finance.backend.vault.error.VaultCannotUpdateMemberError
import dev.zrdzn.finance.backend.vault.error.VaultInsufficientPermissionError
import dev.zrdzn.finance.backend.vault.error.VaultInvitationNotFoundError
import dev.zrdzn.finance.backend.vault.error.VaultInvitationNotOwnedError
import dev.zrdzn.finance.backend.vault.error.VaultMemberNotFoundError
import dev.zrdzn.finance.backend.vault.error.VaultNotFoundByPublicIdError
import dev.zrdzn.finance.backend.vault.error.VaultNotFoundError
import dev.zrdzn.finance.backend.vault.dto.VaultInvitationListResponse
import dev.zrdzn.finance.backend.vault.dto.VaultInvitationResponse
import dev.zrdzn.finance.backend.vault.dto.VaultListResponse
import dev.zrdzn.finance.backend.vault.dto.VaultMemberListResponse
import dev.zrdzn.finance.backend.vault.dto.VaultMemberResponse
import dev.zrdzn.finance.backend.vault.dto.VaultResponse
import dev.zrdzn.finance.backend.vault.dto.VaultRoleResponse
import java.time.Clock
import java.time.Instant
import java.time.temporal.ChronoUnit
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class VaultService(
    private val vaultRepository: VaultRepository,
    private val vaultMemberRepository: VaultMemberRepository,
    private val vaultInvitationRepository: VaultInvitationRepository,
    private val userService: UserService,
    private val clock: Clock
) {

    @Transactional
    fun authorizeMember(vaultId: Int, userId: Int, requiredPermission: VaultPermission): VaultMemberResponse {
        val member = vaultMemberRepository.findByVaultIdAndUserId(vaultId, userId)
            ?.let {
                VaultMemberResponse(
                    id = it.id!!,
                    vaultId = vaultId,
                    user = userService.getUser(it.userId),
                    vaultRole = it.vaultRole
                )
            }
            ?: throw UserNotMemberError()

        when {
            !member.vaultRole.hasPermission(requiredPermission) -> throw VaultInsufficientPermissionError()
        }

        return member
    }

    @Transactional
    fun createVault(ownerId: Int, name: String, currency: String, defaultTransactionMethod: TransactionMethod): VaultResponse =
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
    fun createVaultMemberForcefully(vaultId: Int, userId: Int, vaultRole: VaultRole): VaultMemberResponse {
        val vault = getVaultForcefully(vaultId)

        val member = vaultMemberRepository
            .save(
                VaultMember(
                    id = null,
                    vaultId = vault.id,
                    userId = userId,
                    vaultRole = vaultRole
                )
            )

        return member.toResponse(userService.getUser(userId))
    }

    @Transactional
    fun createVaultInvitation(vaultId: Int, requesterId: Int, userEmail: String): VaultInvitationResponse {
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
    fun updateVault(requesterId: Int, vaultId: Int, name: String, currency: String, transactionMethod: TransactionMethod) {
        val vault = vaultRepository.findById(vaultId) ?: throw VaultNotFoundError()

        authorizeMember(vaultId, requesterId, VaultPermission.SETTINGS_UPDATE)

        vault.name = name
        vault.currency = currency
        vault.transactionMethod = transactionMethod
    }

    @Transactional
    fun updateVaultMember(requesterId: Int, vaultId: Int, vaultMemberId: Int, vaultRole: VaultRole) {
        val requester = authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_UPDATE)
        val vaultMember = vaultMemberRepository.findById(vaultMemberId) ?: throw VaultMemberNotFoundError()

        // check if the requester has higher role than the user he wants to update
        if (!requester.vaultRole.isHigherThan(vaultMember.vaultRole)) {
            throw VaultCannotUpdateMemberError()
        }

        if (vaultRole.isOwner()) {
            throw VaultCannotUpdateMemberError()
        }

        vaultMember.vaultRole = vaultRole
    }

    @Transactional
    fun acceptVaultInvitation(requesterId: Int, invitationId: Int) {
        val invitation = vaultInvitationRepository.findById(invitationId) ?: throw VaultInvitationNotFoundError()

        val vault = getVaultForcefully(invitation.vaultId)

        val requester = userService.getUser(requesterId)

        if (requester.email != invitation.userEmail) {
            throw VaultInvitationNotOwnedError()
        }

        createVaultMemberForcefully(
            vaultId = vault.id,
            userId = requesterId,
            vaultRole = VaultRole.MEMBER
        )

        removeVaultInvitationForcefully(vault.id, invitation.userEmail)
    }

    @Transactional(readOnly = true)
    fun getVaultForcefully(vaultId: Int): VaultResponse {
        return vaultRepository.findById(vaultId)
            ?.toResponse()
            ?: throw VaultNotFoundError()
    }

    @Transactional(readOnly = true)
    fun getVault(vaultId: Int, requesterId: Int): VaultResponse {
        authorizeMember(vaultId, requesterId, VaultPermission.DETAILS_READ)

        return getVaultForcefully(vaultId)
    }

    @Transactional(readOnly = true)
    fun getVaultsByVaultMemberUserId(requesterId: Int): VaultListResponse {
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
    fun getVaultForcefully(publicId: String): VaultResponse? {
        return vaultRepository.findByPublicId(publicId)
            ?.toResponse()
    }

    @Transactional(readOnly = true)
    fun getVault(publicId: String, requesterId: Int): VaultResponse? {
        val vault = getVaultForcefully(publicId) ?: throw VaultNotFoundByPublicIdError()

        authorizeMember(vault.id, requesterId, VaultPermission.DETAILS_READ)

        return vault
    }

    @Transactional(readOnly = true)
    fun getVaultMembers(vaultId: Int, requesterId: Int): VaultMemberListResponse {
        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_READ)

        return VaultMemberListResponse(
            vaultMemberRepository.findByVaultId(vaultId)
                .map { it.toResponse(userService.getUser(it.userId)) }
                .toSet()
        )
    }

    @Transactional(readOnly = true)
    fun getVaultInvitations(vaultId: Int, requesterId: Int): VaultInvitationListResponse {
        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_INVITE_READ)

        return VaultInvitationListResponse(
            vaultInvitationRepository.findByVaultId(vaultId)
                .map { it.toResponse(getVault(vaultId = vaultId, requesterId = requesterId)) }
                .toSet()
        )
    }

    @Transactional(readOnly = true)
    fun getVaultInvitations(requesterId: Int, userEmail: String): VaultInvitationListResponse {
        val requester = userService.getUser(requesterId)

        if (requester.email != userEmail) {
            throw VaultInvitationNotOwnedError()
        }

        return VaultInvitationListResponse(
            vaultInvitationRepository.findByUserEmail(userEmail)
                .map { it.toResponse(getVaultForcefully(vaultId = it.vaultId)) }
                .toSet()
        )
    }

    @Transactional(readOnly = true)
    fun getVaultRole(vaultId: Int, requesterId: Int): VaultRoleResponse {
        return vaultMemberRepository.findByVaultIdAndUserId(vaultId, requesterId)
            ?.vaultRole
            ?.let {
                VaultRoleResponse(
                    name = it.name,
                    weight = it.weight,
                    permissions = it.permissions
                )
            }
            ?: throw UserNotMemberError()
    }

    @Transactional
    fun removeVault(vaultId: Int, requesterId: Int) {
        authorizeMember(vaultId, requesterId, VaultPermission.DELETE)

        vaultRepository.deleteById(vaultId)
    }

    @Transactional
    fun removeVaultMember(vaultId: Int, requesterId: Int, userId: Int) {
        val requester = authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_REMOVE)
        val vaultMember = vaultMemberRepository.findById(userId) ?: throw VaultMemberNotFoundError()

        if (!requester.vaultRole.isHigherThan(vaultMember.vaultRole)) {
            throw VaultCannotDeleteMemberError()
        }

        vaultMemberRepository.deleteByVaultIdAndUserId(vaultId, userId)
    }

    @Transactional
    fun removeVaultInvitationForcefully(vaultId: Int, userEmail: String) {
        vaultInvitationRepository.deleteByVaultIdAndUserEmail(vaultId, userEmail)
    }

    @Transactional
    fun removeVaultInvitation(vaultId: Int, requesterId: Int, userEmail: String) {
        val user = userService.getUser(requesterId)
        if (user.email == userEmail) {
            removeVaultInvitationForcefully(vaultId, userEmail)
            return
        }

        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_INVITE_DELETE)
            .also { removeVaultInvitationForcefully(vaultId, userEmail) }
    }

}