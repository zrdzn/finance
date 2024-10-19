package dev.zrdzn.finance.backend.audit

import dev.zrdzn.finance.backend.audit.api.AuditAction
import dev.zrdzn.finance.backend.audit.api.AuditCreateResponse
import dev.zrdzn.finance.backend.audit.api.AuditListResponse
import dev.zrdzn.finance.backend.audit.api.AuditResponse
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.user.api.UserNotFoundException
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultService
import dev.zrdzn.finance.backend.vault.api.VaultNotFoundException
import dev.zrdzn.finance.backend.vault.api.authority.VaultPermission
import java.time.Clock
import java.time.Instant
import org.slf4j.LoggerFactory

class AuditService(
    private val auditRepository: AuditRepository,
    private val vaultService: VaultService,
    private val userService: UserService,
    private val clock: Clock
) {

    private val logger = LoggerFactory.getLogger(AuditService::class.java)

    fun createAudit(vaultId: VaultId, userId: UserId, auditAction: AuditAction, description: String): AuditCreateResponse =
        auditRepository
            .save(
                Audit(
                    id = null,
                    createdAt = Instant.now(clock),
                    vaultId = vaultId,
                    userId = userId,
                    auditAction = auditAction,
                    description = description
                )
            )
            .also { logger.info("Successfully created audit: $it") }
            .let {
                AuditCreateResponse(
                    id = it.id!!
                )
            }

    fun getAudits(requesterId: UserId, vaultId: VaultId): AuditListResponse {
        vaultService.authorizeMember(vaultId = vaultId, userId = requesterId, requiredPermission = VaultPermission.AUDIT_READ)

        return auditRepository.findByVaultId(vaultId)
            .map {
                AuditResponse(
                    id = it.id!!,
                    createdAt = it.createdAt,
                    vault = vaultService.getVault(vaultId = it.vaultId, requesterId = requesterId),
                    user = userService.getUserById(it.userId),
                    auditAction = it.auditAction,
                    description = it.description
                )
            }
            .toSet()
            .let { AuditListResponse(it) }
    }

}