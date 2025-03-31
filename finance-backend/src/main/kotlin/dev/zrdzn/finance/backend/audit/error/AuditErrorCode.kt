package dev.zrdzn.finance.backend.audit.error

import dev.zrdzn.finance.backend.audit.AuditService.Companion.MAX_DESCRIPTION_LENGTH
import dev.zrdzn.finance.backend.audit.AuditService.Companion.MIN_DESCRIPTION_LENGTH
import org.springframework.http.HttpStatus

enum class AuditErrorCode(val status: Int, val code: String, val description: String) {
    DESCRIPTION_INVALID(
        status = HttpStatus.BAD_REQUEST.value(),
        code = "AUDIT_DESCRIPTION_INVALID",
        description = "Description must be between $MIN_DESCRIPTION_LENGTH and $MAX_DESCRIPTION_LENGTH characters"
    ),
}
