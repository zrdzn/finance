package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.authentication.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.transaction.api.TransactionMethod
import dev.zrdzn.finance.backend.vault.api.VaultCreateRequest
import dev.zrdzn.finance.backend.vault.api.VaultListResponse
import dev.zrdzn.finance.backend.vault.api.VaultResponse
import dev.zrdzn.finance.backend.vault.api.authority.VaultRole
import dev.zrdzn.finance.backend.vault.api.invitation.VaultInvitationCreateRequest
import dev.zrdzn.finance.backend.vault.api.invitation.VaultInvitationResponse
import dev.zrdzn.finance.backend.vault.api.member.VaultMemberUpdateRequest
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

        val name = "Test vault"
        val currency = "PLN"
        val defaultTransactionMethod = TransactionMethod.CARD
        val request = VaultCreateRequest(
            name = name,
            currency = currency,
            transactionMethod = defaultTransactionMethod
        )

        // when
        val response = Unirest.post("/vaults/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(VaultResponse::class.java)

        // then
        val expectedVault = vaultRepository.findByPublicId(response.body.publicId)
        assertNotNull(expectedVault)
        assertEquals(name, expectedVault!!.name)
        assertEquals(currency, expectedVault.currency)
        assertEquals(defaultTransactionMethod, expectedVault.transactionMethod)
        val expectedOwner = vaultMemberRepository.findByVaultId(expectedVault.id!!).firstOrNull()
        assertNotNull(expectedOwner)
        assertEquals(token.userId, expectedOwner!!.userId)
        assertNotNull(response.body)
        assertNotNull(response.body.publicId)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should create vault invitation`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)
        val user = createUser(email = "henry@app.com")

        val request = VaultInvitationCreateRequest(
            userEmail = user.email,
            vaultId = vault.id
        )

        // when
        val response = Unirest.post("/vaults/${vault.id}/invitations")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(VaultInvitationResponse::class.java)

        // then
        val expectedInvitation = vaultInvitationRepository.findByVaultId(vault.id).firstOrNull()
        assertNotNull(expectedInvitation)
        assertEquals(vault.id, expectedInvitation!!.vaultId)
        assertEquals(user.email, expectedInvitation.userEmail)
        assertEquals(response.body.id, expectedInvitation.vaultId)
        assertEquals(response.status, HttpStatus.OK.value())
    }

    @Test
    fun `should update vault`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        val newName = "Updated vault"
        val newCurrency = "USD"
        val newTransactionMethod = TransactionMethod.CASH

        // when
        val response = Unirest.patch("/vaults/${vault.id}")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(
                VaultCreateRequest(
                    name = newName,
                    currency = newCurrency,
                    transactionMethod = newTransactionMethod
                )
            )
            .asEmpty()

        // then
        val expectedVault = vaultRepository.findByPublicId(vault.publicId)
        assertNotNull(expectedVault)
        assertEquals(newName, expectedVault!!.name)
        assertEquals(newCurrency, expectedVault.currency)
        assertEquals(newTransactionMethod, expectedVault.transactionMethod)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should update vault member`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)
        val user = createUser(email = "henry@app.com")
        createVaultMember(vault.id, user.id, VaultRole.MEMBER)

        val request = VaultMemberUpdateRequest(
            vaultRole = VaultRole.MEMBER
        )

        // when
        val response = Unirest.patch("/vaults/${vault.id}/members/${user.id}")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(VaultInvitationResponse::class.java)

        // then
        val expectedInvitation = vaultInvitationRepository.findByVaultId(vault.id).firstOrNull()
        assertNotNull(expectedInvitation)
        assertEquals(vault.id, expectedInvitation!!.vaultId)
        assertEquals(user.email, expectedInvitation.userEmail)
        assertEquals(response.body.id, expectedInvitation.vaultId)
        assertEquals(response.status, HttpStatus.OK.value())
    }

    @Test
    fun `should get vaults`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        // when
        val response = Unirest.get("/vaults")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(VaultListResponse::class.java)

        // then
        val expectedVault = response.body.vaults.firstOrNull()
        assertNotNull(expectedVault)
        assertEquals(vault.publicId, expectedVault!!.publicId)
        assertEquals(vault.name, expectedVault.name)
        assertEquals(vault.currency, expectedVault.currency)
        assertEquals(vault.transactionMethod, expectedVault.transactionMethod)

        assertNotNull(response.body)
        assertEquals(HttpStatus.OK.value(), response.status)
        assertEquals(1, response.body.vaults.size)
        assertEquals(vault.publicId, response.body.vaults.first().publicId)
    }

}