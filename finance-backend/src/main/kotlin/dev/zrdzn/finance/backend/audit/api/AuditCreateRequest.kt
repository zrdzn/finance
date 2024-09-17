package dev.zrdzn.finance.backend.audit.api

import dev.zrdzn.finance.backend.vault.VaultMemberId

data class AuditCreateRequest(
    val memberId: VaultMemberId,
    val description: String
)
