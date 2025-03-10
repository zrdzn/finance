package dev.zrdzn.finance.backend.audit

import dev.zrdzn.finance.backend.audit.dto.AuditListResponse
import dev.zrdzn.finance.backend.token.TOKEN_COOKIE_NAME
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class AuditControllerTest : AuditSpecification() {

    @Test
    fun `should get audits`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)
        val audit = createAudit(userId = token.userId, vaultId = vault.id)

        // when
        val response = Unirest.get("/audits/${vault.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(AuditListResponse::class.java)

        // then
        val expectedAudits = auditRepository.findByVaultId(vault.id)
        assertNotNull(expectedAudits)
        assertNotNull(response.body)
        assertEquals(response.body.audits.size, expectedAudits.size)
        assertNotNull(response.body.audits.firstOrNull())
        assertEquals(response.body.audits.first().id, audit.id)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

}