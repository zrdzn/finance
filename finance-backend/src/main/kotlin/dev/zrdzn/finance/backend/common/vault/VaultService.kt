package dev.zrdzn.finance.backend.common.vault

import dev.zrdzn.finance.backend.api.user.UserNotFoundByEmailException
import dev.zrdzn.finance.backend.api.vault.VaultCreateResponse
import dev.zrdzn.finance.backend.api.vault.VaultInvitationListResponse
import dev.zrdzn.finance.backend.api.vault.VaultInvitationNotFoundException
import dev.zrdzn.finance.backend.api.vault.VaultInvitationResponse
import dev.zrdzn.finance.backend.api.vault.VaultListResponse
import dev.zrdzn.finance.backend.api.vault.VaultMemberListResponse
import dev.zrdzn.finance.backend.api.vault.VaultMemberResponse
import dev.zrdzn.finance.backend.api.vault.VaultNotFoundException
import dev.zrdzn.finance.backend.api.vault.VaultResponse
import dev.zrdzn.finance.backend.api.vault.VaultRole
import dev.zrdzn.finance.backend.common.shared.createRandomToken
import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.user.UserService
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
    open fun createVault(ownerId: UserId, name: String): VaultCreateResponse =
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
            .also {
                createVaultMember(
                    vaultId = it.id,
                    userId = ownerId,
                    vaultRole = VaultRole.OWNER
                )
            }
            .also { logger.info("Successfully created new vault: $it") }

    @Transactional
    open fun createVaultMember(vaultId: VaultId, userId: UserId, vaultRole: VaultRole) {
        val vault = getVault(vaultId) ?: throw VaultNotFoundException(vaultId)

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
    open fun createVaultInvitation(vaultId: VaultId, userEmail: String) {
        val vault = getVault(vaultId) ?: throw VaultNotFoundException(vaultId)

        vaultInvitationRepository
            .save(
                VaultInvitation(
                    id = null,
                    vaultId = vault.id,
                    userEmail = userEmail,
                    expiresAt = Instant.now(clock).plus(1, ChronoUnit.DAYS)
                )
            )
            .also { logger.info("Successfully created new invitation for vault: ${vault.name} for user with email: $userEmail") }
    }

    @Transactional
    open fun acceptVaultInvitation(invitationId: VaultInvitationId) {
        val invitation = vaultInvitationRepository.findById(invitationId) ?: throw VaultInvitationNotFoundException(invitationId)

        val vault = getVault(invitation.vaultId) ?: throw VaultNotFoundException(invitation.vaultId)

        val user = userService.getUserByEmail(invitation.userEmail) ?: throw UserNotFoundByEmailException(invitation.userEmail)

        createVaultMember(
            vaultId = vault.id,
            userId = user.id,
            vaultRole = VaultRole.MEMBER
        )

        removeVaultInvitation(vault.id, invitation.userEmail)
        logger.info("Successfully accepted invitation for vault: ${vault.name} for user with email: ${invitation.userEmail}")
    }

    @Transactional(readOnly = true)
    open fun getVault(vaultId: VaultId): VaultResponse? =
        vaultRepository.findById(vaultId)
            ?.let {
                VaultResponse(
                    id = it.id!!,
                    publicId = it.publicId,
                    ownerId = it.ownerId,
                    name = it.name
                )
            }

    @Transactional(readOnly = true)
    open fun getVaultsByVaultMemberUserId(userId: UserId): VaultListResponse =
        VaultListResponse(
            vaultMemberRepository.findVaultsByUserId(userId)
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

    @Transactional(readOnly = true)
    open fun getVaultByPublicId(publicId: VaultPublicId): VaultResponse? {
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

    @Transactional(readOnly = true)
    open fun getVaultMembers(vaultId: VaultId): VaultMemberListResponse =
        VaultMemberListResponse(
            vaultMemberRepository.findByVaultId(vaultId)
                .map {
                    VaultMemberResponse(
                        id = it.id!!,
                        vaultId = it.vaultId,
                        user = userService.getUserById(it.userId)!!,
                        role = it.vaultRole
                    )
                }
                .toSet()
        )

    @Transactional(readOnly = true)
    open fun getVaultInvitations(vaultId: VaultId): VaultInvitationListResponse =
        VaultInvitationListResponse(
            vaultInvitationRepository.findByVaultId(vaultId)
                .map {
                    VaultInvitationResponse(
                        id = it.id!!,
                        vault = getVault(it.vaultId)!!,
                        userEmail = it.userEmail,
                        expiresAt = it.expiresAt
                    )
                }
                .toSet()
        )

    @Transactional(readOnly = true)
    open fun getVaultInvitations(userEmail: String): VaultInvitationListResponse =
        VaultInvitationListResponse(
            vaultInvitationRepository.findByUserEmail(userEmail)
                .map {
                    VaultInvitationResponse(
                        id = it.id!!,
                        vault = getVault(it.vaultId)!!,
                        userEmail = it.userEmail,
                        expiresAt = it.expiresAt
                    )
                }
                .toSet()
        )

    @Transactional
    open fun removeVaultMember(vaultId: VaultId, userId: UserId): Unit =
        vaultMemberRepository.deleteByVaultIdAndUserId(vaultId, userId)
            .also { logger.info("Successfully removed member with id: $userId from vault with id: $vaultId") }

    @Transactional
    open fun removeVaultInvitation(vaultId: VaultId, userEmail: String): Unit =
        vaultInvitationRepository.deleteByVaultIdAndUserEmail(vaultId, userEmail)
            .also { logger.info("Successfully removed invitation for user email: $userEmail") }

}
