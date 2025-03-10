package dev.zrdzn.finance.backend.audit.dto

data class AuditListResponse(
    val audits: Set<AuditResponse>
)
