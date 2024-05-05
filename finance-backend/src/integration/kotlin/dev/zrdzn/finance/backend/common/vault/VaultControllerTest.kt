package dev.zrdzn.finance.backend.common.vault

import dev.zrdzn.finance.backend.api.vault.VaultCreateRequest
import dev.zrdzn.finance.backend.api.vault.VaultCreateResponse
import dev.zrdzn.finance.backend.api.vault.VaultListResponse
import dev.zrdzn.finance.backend.common.authentication.token.TOKEN_COOKIE_NAME
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class VaultControllerTest : VaultSpecification() {

    @Test
    fun `should create vault`() {
        // given
        val token = createUserAndAuthenticate()

        val vaultCreateRequest = VaultCreateRequest(
            name = "Real treasure"
        )

        // when
        val vaultCreateResponse = Unirest.post("/vaults/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(vaultCreateRequest)
            .asObject(VaultCreateResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), vaultCreateResponse.status)
        assertNotNull(vaultCreateResponse.body)
        assertNotNull(vaultCreateResponse.body.publicId)
    }

    @Test
    fun `should get vaults`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        // when
        val vaultListResponse = Unirest.get("/vaults")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(VaultListResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), vaultListResponse.status)
        assertNotNull(vaultListResponse.body)
        assertEquals(1, vaultListResponse.body.vaults.size)
        assertEquals(vault.publicId, vaultListResponse.body.vaults.first().publicId)
    }

}