package dev.zrdzn.finance.backend.audit.application

import dev.zrdzn.finance.backend.audit.application.response.AuditListResponse
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/audits")
class AuditController(
    private val auditService: AuditService
) {

    @GetMapping("/{vaultId}")
    fun getAudits(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int
    ): AuditListResponse = auditService.getAudits(requesterId = userId, vaultId = vaultId)

}