package dev.zrdzn.finance.backend.audit

import dev.zrdzn.finance.backend.audit.AuditMapper.toResponse
import dev.zrdzn.finance.backend.audit.dto.AuditListResponse
import dev.zrdzn.finance.backend.audit.dto.AuditResponse
import dev.zrdzn.finance.backend.audit.error.AuditDescriptionInvalidError
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.vault.VaultPermission
import dev.zrdzn.finance.backend.vault.VaultService
import java.time.Clock
import java.time.Instant
import org.springframework.stereotype.Service

@Service
class AuditService(
    private val auditRepository: AuditRepository,
    private val vaultService: VaultService,
    private val userService: UserService,
    private val clock: Clock
) {

    companion object {
        const val MIN_DESCRIPTION_LENGTH = 3
        const val MAX_DESCRIPTION_LENGTH = 255
    }

    fun createAudit(vaultId: Int, userId: Int, auditAction: AuditAction, description: String): AuditResponse {
        if (description.length !in MIN_DESCRIPTION_LENGTH..MAX_DESCRIPTION_LENGTH) throw AuditDescriptionInvalidError()

        return auditRepository
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
    }

    fun getAudits(requesterId: Int, vaultId: Int): AuditListResponse =
        vaultService.withAuthorization(vaultId, requesterId, VaultPermission.AUDIT_READ) {
            auditRepository.findByVaultId(vaultId)
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