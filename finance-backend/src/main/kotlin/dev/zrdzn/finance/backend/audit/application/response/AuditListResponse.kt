package dev.zrdzn.finance.backend.audit.application.response

data class AuditListResponse(
    val audits: Set<AuditResponse>
)
