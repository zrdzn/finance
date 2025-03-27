package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.shared.createRandomToken
import dev.zrdzn.finance.backend.transaction.TransactionMethod
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.vault.VaultMapper.toResponse
import dev.zrdzn.finance.backend.vault.dto.VaultInvitationListResponse
import dev.zrdzn.finance.backend.vault.dto.VaultInvitationResponse
import dev.zrdzn.finance.backend.vault.dto.VaultListResponse
import dev.zrdzn.finance.backend.vault.dto.VaultMemberListResponse
import dev.zrdzn.finance.backend.vault.dto.VaultMemberResponse
import dev.zrdzn.finance.backend.vault.dto.VaultResponse
import dev.zrdzn.finance.backend.vault.dto.VaultRoleResponse
import dev.zrdzn.finance.backend.vault.error.UserNotMemberError
import dev.zrdzn.finance.backend.vault.error.VaultCannotDeleteMemberError
import dev.zrdzn.finance.backend.vault.error.VaultCannotUpdateMemberError
import dev.zrdzn.finance.backend.vault.error.VaultCurrencyInvalidError
import dev.zrdzn.finance.backend.vault.error.VaultInsufficientPermissionError
import dev.zrdzn.finance.backend.vault.error.VaultInvitationNotFoundError
import dev.zrdzn.finance.backend.vault.error.VaultInvitationNotOwnedError
import dev.zrdzn.finance.backend.vault.error.VaultMemberNotFoundError
import dev.zrdzn.finance.backend.vault.error.VaultNameLengthInvalidError
import dev.zrdzn.finance.backend.vault.error.VaultNotFoundByPublicIdError
import dev.zrdzn.finance.backend.vault.error.VaultNotFoundError
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

    companion object {
        const val MIN_NAME_LENGTH = 3
        const val MAX_NAME_LENGTH = 100
    }

    fun <T> withAuthorization(
        vaultId: Int,
        userId: Int,
        requiredPermission: VaultPermission,
        block: (VaultMemberResponse) -> T
    ): T {
        val member = vaultMemberRepository.findByVaultIdAndUserId(vaultId, userId)
            ?.let { it.toResponse(userService.getUser(it.userId)) }
            ?: throw UserNotMemberError()

        if (!member.vaultRole.hasPermission(requiredPermission)) {
            throw VaultInsufficientPermissionError()
        }

        return block(member)
    }

    @Transactional
    fun createVault(ownerId: Int, name: String, currency: String, defaultTransactionMethod: TransactionMethod): VaultResponse {
        if (name.length <= MIN_NAME_LENGTH || name.length >= MAX_NAME_LENGTH) throw VaultNameLengthInvalidError()
        if (currency.length != 3) throw VaultCurrencyInvalidError()

        return vaultRepository
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
    fun createVaultInvitation(vaultId: Int, requesterId: Int, userEmail: String): VaultInvitationResponse =
        withAuthorization(vaultId, requesterId, VaultPermission.MEMBER_INVITE_CREATE) {
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

            invitation.toResponse(vault)
        }

    @Transactional
    fun updateVault(requesterId: Int, vaultId: Int, name: String, currency: String, transactionMethod: TransactionMethod) =
        withAuthorization(vaultId, requesterId, VaultPermission.SETTINGS_UPDATE) {
            val vault = vaultRepository.findById(vaultId) ?: throw VaultNotFoundError()

            if (name.length <= MIN_NAME_LENGTH || name.length >= MAX_NAME_LENGTH) throw VaultNameLengthInvalidError()
            if (currency.length != 3) throw VaultCurrencyInvalidError()

            vault.name = name
            vault.currency = currency
            vault.transactionMethod = transactionMethod
        }

    @Transactional
    fun updateVaultMember(requesterId: Int, vaultId: Int, vaultMemberId: Int, vaultRole: VaultRole) =
        withAuthorization(vaultId, requesterId, VaultPermission.MEMBER_UPDATE) {
            val vaultMember = vaultMemberRepository.findById(vaultMemberId) ?: throw VaultMemberNotFoundError()

            // check if the requester has higher role than the user he wants to update
            if (!it.vaultRole.isHigherThan(vaultMember.vaultRole)) {
                throw VaultCannotUpdateMemberError()
            }

            if (vaultRole.isOwner()) {
                throw VaultCannotUpdateMemberError()
            }

            if (requesterId == vaultMemberId) {
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
    fun getVault(vaultId: Int, requesterId: Int): VaultResponse =
        withAuthorization(vaultId, requesterId, VaultPermission.DETAILS_READ) {
            getVaultForcefully(vaultId)
        }

    @Transactional(readOnly = true)
    fun getVaultsByVaultMemberUserId(requesterId: Int): VaultListResponse {
        return VaultListResponse(
            vaultMemberRepository.findVaultsByUserId(requesterId)
                .map {
                    withAuthorization(it.id!!, requesterId, VaultPermission.DETAILS_READ) { _ ->
                        it.toResponse()
                    }
                }
                .toSet()
        )
    }

    @Transactional(readOnly = true)
    fun getVaultForcefully(publicId: String): VaultResponse? =
        vaultRepository.findByPublicId(publicId)?.toResponse()

    @Transactional(readOnly = true)
    fun getVault(publicId: String, requesterId: Int): VaultResponse? {
        val vault = getVaultForcefully(publicId) ?: throw VaultNotFoundByPublicIdError()

        return withAuthorization(vault.id, requesterId, VaultPermission.DETAILS_READ) {
            vault
        }
    }

    @Transactional(readOnly = true)
    fun getVaultMembers(vaultId: Int, requesterId: Int): VaultMemberListResponse =
        withAuthorization(vaultId, requesterId, VaultPermission.MEMBER_READ) {
            VaultMemberListResponse(
                vaultMemberRepository.findByVaultId(vaultId)
                    .map { it.toResponse(userService.getUser(it.userId)) }
                    .toSet()
            )
        }

    @Transactional(readOnly = true)
    fun getVaultInvitations(vaultId: Int, requesterId: Int): VaultInvitationListResponse =
        withAuthorization(vaultId, requesterId, VaultPermission.MEMBER_INVITE_READ) {
            VaultInvitationListResponse(
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
    fun removeVault(vaultId: Int, requesterId: Int) =
        withAuthorization(vaultId, requesterId, VaultPermission.DELETE) {
            vaultRepository.deleteById(vaultId)
        }

    @Transactional
    fun removeVaultMember(vaultId: Int, requesterId: Int, userId: Int) =
        withAuthorization(vaultId, requesterId, VaultPermission.MEMBER_REMOVE) {
            val vaultMember = vaultMemberRepository.findById(userId) ?: throw VaultMemberNotFoundError()

            if (!it.vaultRole.isHigherThan(vaultMember.vaultRole)) {
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
        // remove invitation by the invited user
        if (user.email == userEmail) {
            removeVaultInvitationForcefully(vaultId, userEmail)
            return
        }

        return withAuthorization(vaultId, requesterId, VaultPermission.MEMBER_INVITE_DELETE) {
            removeVaultInvitationForcefully(vaultId, userEmail)
        }
    }

}