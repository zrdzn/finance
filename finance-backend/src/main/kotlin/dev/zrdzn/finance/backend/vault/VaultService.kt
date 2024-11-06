package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.shared.createRandomToken
import dev.zrdzn.finance.backend.transaction.api.TransactionMethod
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.vault.api.*
import dev.zrdzn.finance.backend.vault.api.authority.*
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
import org.slf4j.LoggerFactory
import org.springframework.transaction.annotation.Transactional

open class VaultService(
    private val vaultRepository: VaultRepository,
    private val vaultMemberRepository: VaultMemberRepository,
    private val vaultInvitationRepository: VaultInvitationRepository,
    private val userService: UserService,
    private val clock: Clock
) {

    private val logger = LoggerFactory.getLogger(VaultService::class.java)

    @Transactional
    open fun authorizeMember(vaultId: VaultId, userId: UserId, requiredPermission: VaultPermission): VaultMemberResponse {
        val member = vaultMemberRepository.findByVaultIdAndUserId(vaultId, userId)
            ?.let {
                VaultMemberResponse(
                    id = it.id!!,
                    vaultId = vaultId,
                    user = userService.getUserById(it.userId),
                    vaultRole = it.vaultRole
                )
            } ?: throw UserNotMemberException()

        when {
            !member.vaultRole.hasPermission(requiredPermission) -> throw VaultInsufficientPermissionException()
        }

        return member
    }

    @Transactional
    open fun createVault(ownerId: UserId, name: String, defaultCurrency: Currency, defaultTransactionMethod: TransactionMethod): VaultCreateResponse =
        vaultRepository
            .save(
                Vault(
                    id = null,
                    createdAt = Instant.now(clock),
                    publicId = createRandomToken(16),
                    ownerId = ownerId,
                    name = name,
                    currency = defaultCurrency,
                    transactionMethod = defaultTransactionMethod
                )
            )
            .let {
                VaultCreateResponse(
                    id = it.id!!,
                    publicId = it.publicId
                )
            }
            .also {
                createVaultMemberForcefully(
                    vaultId = it.id,
                    userId = ownerId,
                    vaultRole = VaultRole.OWNER
                )
            }
            .also { logger.info("Successfully created new vault: $it") }

    @Transactional
    open fun createVaultMemberForcefully(vaultId: VaultId, userId: UserId, vaultRole: VaultRole) {
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
            .also { logger.info("Successfully added new member with id: $userId to vault: ${vault.name}") }
    }

    @Transactional
    open fun createVaultInvitation(vaultId: VaultId, requesterId: UserId, userEmail: String) {
        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_INVITE_CREATE)

        val vault = getVault(vaultId, requesterId)

        vaultInvitationRepository
            .save(
                VaultInvitation(
                    id = null,
                    vaultId = vault.id,
                    userEmail = userEmail,
                    expiresAt = Instant.now(clock).plus(1, ChronoUnit.DAYS)
                )
            )
            .also { logger.info("Successfully created new invitation for vault: ${vault.name} for user with id: $userEmail") }
    }

    @Transactional
    open fun updateVault(requesterId: UserId, vaultId: VaultId, name: String, currency: Currency, transactionMethod: TransactionMethod) {
        val vault = vaultRepository.findById(vaultId) ?: throw VaultNotFoundException()

        authorizeMember(vaultId, requesterId, VaultPermission.SETTINGS_UPDATE)

        vault.name = name
        vault.currency = currency
        vault.transactionMethod = transactionMethod

        logger.info("Successfully updated vault: $vault")
    }

    @Transactional
    open fun updateVaultMember(requesterId: UserId, vaultId: VaultId, vaultMemberId: VaultMemberId, vaultRole: VaultRole) {
        val vault = getVault(vaultId, requesterId)
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

        logger.info("Successfully updated member with id: $vaultMemberId in vault: ${vault.name}")
    }

    @Transactional
    open fun acceptVaultInvitation(requesterId: UserId, invitationId: VaultInvitationId) {
        val invitation = vaultInvitationRepository.findById(invitationId) ?: throw VaultInvitationNotFoundException()

        val vault = getVaultForcefully(invitation.vaultId)

        val requester = userService.getUserById(requesterId)

        if (requester.email != invitation.userEmail) {
            throw VaultInvitationNotOwnedException()
        }

        createVaultMemberForcefully(
            vaultId = vault.id,
            userId = requesterId,
            vaultRole = VaultRole.MEMBER
        )

        removeVaultInvitationForcefully(vault.id, invitation.userEmail)
        logger.info("Successfully accepted invitation for vault: ${vault.name} for user with id: ${requester.id}")
    }

    @Transactional(readOnly = true)
    open fun getVaultForcefully(vaultId: VaultId): VaultResponse {
        return vaultRepository.findById(vaultId)
            ?.let {
                VaultResponse(
                    id = it.id!!,
                    createdAt = it.createdAt,
                    publicId = it.publicId,
                    ownerId = it.ownerId,
                    name = it.name,
                    currency = it.currency,
                    transactionMethod = it.transactionMethod
                )
            }
            ?: throw VaultNotFoundException()
    }

    @Transactional(readOnly = true)
    open fun getVault(vaultId: VaultId, requesterId: UserId): VaultResponse {
        authorizeMember(vaultId, requesterId, VaultPermission.DETAILS_READ)

        return getVaultForcefully(vaultId)
    }

    @Transactional(readOnly = true)
    open fun getVaultsByVaultMemberUserId(requesterId: UserId): VaultListResponse {
        return VaultListResponse(
            vaultMemberRepository.findVaultsByUserId(requesterId)
                .map {
                    authorizeMember(it.id!!, requesterId, VaultPermission.DETAILS_READ)

                    VaultResponse(
                        id = it.id!!,
                        createdAt = it.createdAt,
                        publicId = it.publicId,
                        ownerId = it.ownerId,
                        name = it.name,
                        currency = it.currency,
                        transactionMethod = it.transactionMethod
                    )
                }
                .toSet()
        )
    }

    @Transactional(readOnly = true)
    open fun getVaultByPublicIdForcefully(publicId: VaultPublicId): VaultResponse? {
        return vaultRepository.findByPublicId(publicId)
            ?.let {
                VaultResponse(
                    id = it.id!!,
                    createdAt = it.createdAt,
                    publicId = it.publicId,
                    ownerId = it.ownerId,
                    name = it.name,
                    currency = it.currency,
                    transactionMethod = it.transactionMethod
                )
            }
    }

    @Transactional(readOnly = true)
    open fun getVaultByPublicId(publicId: VaultPublicId, requesterId: UserId): VaultResponse? {
        val vault = getVaultByPublicIdForcefully(publicId) ?: throw VaultNotFoundByPublicIdException()

        authorizeMember(vault.id, requesterId, VaultPermission.DETAILS_READ)

        return vault
    }

    @Transactional(readOnly = true)
    open fun getVaultMembers(vaultId: VaultId, requesterId: UserId): VaultMemberListResponse {
        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_READ)

        return VaultMemberListResponse(
            vaultMemberRepository.findByVaultId(vaultId)
                .map {
                    VaultMemberResponse(
                        id = it.id!!,
                        vaultId = it.vaultId,
                        user = userService.getUserById(it.userId),
                        vaultRole = it.vaultRole
                    )
                }
                .toSet()
        )
    }

    @Transactional(readOnly = true)
    open fun getVaultInvitations(vaultId: VaultId, requesterId: UserId): VaultInvitationListResponse {
        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_INVITE_READ)

        return VaultInvitationListResponse(
            vaultInvitationRepository.findByVaultId(vaultId)
                .map {
                    VaultInvitationResponse(
                        id = it.id!!,
                        vault = getVaultForcefully(it.vaultId),
                        userEmail = it.userEmail,
                        expiresAt = it.expiresAt
                    )
                }
                .toSet()
        )
    }

    @Transactional(readOnly = true)
    open fun getVaultInvitations(requesterId: UserId, userEmail: String): VaultInvitationListResponse {
        val requester = userService.getUserById(requesterId)

        if (requester.email != userEmail) {
            throw VaultInvitationNotOwnedException()
        }

        return VaultInvitationListResponse(
            vaultInvitationRepository.findByUserEmail(userEmail)
                .map {
                    VaultInvitationResponse(
                        id = it.id!!,
                        vault = getVaultForcefully(it.vaultId),
                        userEmail = it.userEmail,
                        expiresAt = it.expiresAt
                    )
                }
                .toSet()
        )
    }

    @Transactional(readOnly = true)
    open fun getVaultRole(vaultId: VaultId, requesterId: UserId): VaultRoleResponse {
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
    open fun removeVault(vaultId: VaultId, requesterId: UserId) {
        authorizeMember(vaultId, requesterId, VaultPermission.DELETE)

        vaultRepository.deleteById(vaultId)
        logger.info("Successfully removed vault with id: $vaultId")
    }

    @Transactional
    open fun removeVaultMember(vaultId: VaultId, requesterId: UserId, userId: UserId) =
        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_REMOVE)
            .also {
                vaultMemberRepository.deleteByVaultIdAndUserId(vaultId, userId)
                logger.info("Successfully removed member with id: $userId from vault with id: $vaultId")
            }

    @Transactional
    open fun removeVaultInvitationForcefully(vaultId: VaultId, userEmail: String) {
        vaultInvitationRepository.deleteByVaultIdAndUserEmail(vaultId, userEmail)
        logger.info("Successfully removed invitation for user email: $userEmail")
    }

    @Transactional
    open fun removeVaultInvitation(vaultId: VaultId, requesterId: UserId, userEmail: String) {
        val user = userService.getUserById(requesterId)
        if (user.email == userEmail) {
            removeVaultInvitationForcefully(vaultId, userEmail)
            return
        }

        authorizeMember(vaultId, requesterId, VaultPermission.MEMBER_INVITE_DELETE)
            .also { removeVaultInvitationForcefully(vaultId, userEmail) }
    }

}
