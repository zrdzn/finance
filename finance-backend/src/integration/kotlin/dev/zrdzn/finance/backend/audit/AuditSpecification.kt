package dev.zrdzn.finance.backend.audit

import dev.zrdzn.finance.backend.audit.domain.AuditAction
import dev.zrdzn.finance.backend.audit.application.response.AuditResponse
import dev.zrdzn.finance.backend.audit.application.AuditService
import dev.zrdzn.finance.backend.audit.domain.AuditRepository
import dev.zrdzn.finance.backend.product.ProductSpecification

open class AuditSpecification : ProductSpecification() {

    protected val auditService: AuditService get() = application.getBean(AuditService::class.java)
    protected val auditRepository: AuditRepository get() = application.getBean(AuditRepository::class.java)

    fun createAudit(
        userId: Int,
        vaultId: Int,
        description: String = "",
        auditAction: AuditAction = AuditAction.PRODUCT_CREATED
    ): AuditResponse =
        auditService.createAudit(
            userId = userId,
            vaultId = vaultId,
            description = description,
            auditAction = auditAction
        )

}