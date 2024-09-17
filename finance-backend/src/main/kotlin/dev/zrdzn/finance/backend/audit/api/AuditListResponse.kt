package dev.zrdzn.finance.backend.audit.api

data class AuditListResponse(
    val audits: Set<AuditResponse>
)
