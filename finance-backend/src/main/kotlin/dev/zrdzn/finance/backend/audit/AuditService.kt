package dev.zrdzn.finance.backend.audit

import dev.zrdzn.finance.backend.audit.api.AuditCreateResponse
import dev.zrdzn.finance.backend.audit.api.AuditListResponse
import dev.zrdzn.finance.backend.audit.api.AuditResponse
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultMemberId
import dev.zrdzn.finance.backend.vault.VaultService
import dev.zrdzn.finance.backend.vault.api.VaultPermission
import java.time.Clock
import java.time.Instant
import org.slf4j.LoggerFactory

class AuditService(
    private val auditRepository: AuditRepository,
    private val vaultService: VaultService,
    private val clock: Clock
) {

    private val logger = LoggerFactory.getLogger(AuditService::class.java)

    fun createAudit(vaultMemberId: VaultMemberId, description: String): AuditCreateResponse =
        auditRepository
            .save(
                Audit(
                    id = null,
                    createdAt = Instant.now(clock),
                    memberId = vaultMemberId,
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
                    vaultMember = vaultService.getVaultMemberForcefully(it.memberId),
                    description = it.description
                )
            }
            .toSet()
            .let { AuditListResponse(it) }
    }

}