package dev.zrdzn.finance.backend.audit

import dev.zrdzn.finance.backend.audit.api.AuditAction
import dev.zrdzn.finance.backend.audit.api.AuditListResponse
import dev.zrdzn.finance.backend.audit.api.AuditResponse
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.vault.VaultService
import dev.zrdzn.finance.backend.vault.api.authority.VaultPermission
import java.time.Clock
import java.time.Instant

class AuditService(
    private val auditRepository: AuditRepository,
    private val vaultService: VaultService,
    private val userService: UserService,
    private val clock: Clock
) {

    fun createAudit(vaultId: Int, userId: Int, auditAction: AuditAction, description: String): AuditResponse =
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
            .let {
                it.toResponse(
                    vault = vaultService.getVaultForcefully(it.vaultId),
                    user = userService.getUser(it.userId)
                )
            }

    fun getAudits(requesterId: Int, vaultId: Int): AuditListResponse {
        vaultService.authorizeMember(vaultId = vaultId, userId = requesterId, requiredPermission = VaultPermission.AUDIT_READ)

        return auditRepository.findByVaultId(vaultId)
            .map {
                it.toResponse(
                    vault = vaultService.getVault(it.vaultId, requesterId),
                    user = userService.getUser(it.userId)
                )
            }
            .toSet()
            .let { AuditListResponse(it) }
    }

}