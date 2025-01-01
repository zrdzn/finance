package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.token.domain.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.transaction.domain.TransactionMethod
import dev.zrdzn.finance.backend.vault.application.request.VaultCreateRequest
import dev.zrdzn.finance.backend.vault.application.response.VaultListResponse
import dev.zrdzn.finance.backend.vault.application.response.VaultResponse
import dev.zrdzn.finance.backend.vault.application.VaultRole
import dev.zrdzn.finance.backend.vault.application.response.VaultRoleResponse
import dev.zrdzn.finance.backend.vault.application.request.VaultInvitationCreateRequest
import dev.zrdzn.finance.backend.vault.application.response.VaultInvitationListResponse
import dev.zrdzn.finance.backend.vault.application.response.VaultInvitationResponse
import dev.zrdzn.finance.backend.vault.application.response.VaultMemberListResponse
import dev.zrdzn.finance.backend.vault.application.request.VaultMemberUpdateRequest
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
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

    @Test
    fun `should get vault by public id`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        // when
        val response = Unirest.get("/vaults/${vault.publicId}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(VaultResponse::class.java)

        // then
        assertNotNull(response.body)
        assertEquals(HttpStatus.OK.value(), response.status)
        assertEquals(vault.publicId, response.body.publicId)
        assertEquals(vault.name, response.body.name)
    }

    @Test
    fun `should get vault members`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)
        val user = createUser(email = "henry@app.com")
        createVaultMember(vault.id, user.id, VaultRole.MEMBER)

        // when
        val response = Unirest.get("/vaults/${vault.id}/members")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(VaultMemberListResponse::class.java)

        // then
        val expectedMembers = response.body.vaultMembers
        assertEquals(2, expectedMembers.size)
    }

    @Test
    fun `should accept vault invitation by invited user`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)
        val user = createUserAndAuthenticate(userCreateRequest = createUserCreateRequest(email = "henry@app.com"))
        val invitation = createVaultInvitation(vault.id, token.userId, user.email)

        // when
        val response = Unirest.post("/vaults/invitations/${invitation.id}/accept")
            .cookie(TOKEN_COOKIE_NAME, user.value)
            .asEmpty()

        // then
        val expectedMember = vaultMemberRepository.findByVaultId(vault.id).firstOrNull { it.userId == user.userId }
        assertNotNull(expectedMember)
        assertEquals(user.userId, expectedMember!!.userId)
        assertEquals(vault.id, expectedMember.vaultId)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should get vault invitations`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)
        val user = createUser(email = "henry@app.com")
        val invitation = createVaultInvitation(vault.id, token.userId, user.email)

        // when
        val response = Unirest.get("/vaults/${vault.id}/invitations")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(VaultInvitationListResponse::class.java)

        // then
        val expectedInvitations = response.body.vaultInvitations.firstOrNull()
        assertNotNull(expectedInvitations)
        assertEquals(invitation.id, expectedInvitations!!.id)
        assertEquals(vault.id, expectedInvitations.vault.id)
        assertEquals(user.email, expectedInvitations.userEmail)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should get vault invitations by user email by invited user`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)
        val user = createUserAndAuthenticate(userCreateRequest = createUserCreateRequest(email = "henry@app.com"))
        val invitation = createVaultInvitation(vault.id, token.userId, user.email)

        // when
        val response = Unirest.get("/vaults/invitations/${user.email}")
            .cookie(TOKEN_COOKIE_NAME, user.value)
            .asObject(VaultInvitationListResponse::class.java)

        // then
        val expectedInvitations = response.body.vaultInvitations.firstOrNull()
        assertNotNull(expectedInvitations)
        assertEquals(invitation.id, expectedInvitations!!.id)
        assertEquals(vault.id, expectedInvitations.vault.id)
        assertEquals(user.email, expectedInvitations.userEmail)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should get vault role`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        // when
        val response = Unirest.get("/vaults/${vault.id}/role")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(VaultRoleResponse::class.java)

        // then
        assertEquals(VaultRole.OWNER.name, response.body.name)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should remove vault`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        // when
        val response = Unirest.delete("/vaults/${vault.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asEmpty()

        // then
        val expectedVault = vaultRepository.findByPublicId(vault.publicId)
        assertNull(expectedVault)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should remove vault member`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)
        val user = createUser(email = "henry@app.com")
        val member = createVaultMember(vault.id, user.id, VaultRole.MEMBER)

        // when
        val response = Unirest.delete("/vaults/${vault.id}/members/${member.user.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asEmpty()

        // then
        val expectedMember = vaultMemberRepository.findByVaultId(vault.id).firstOrNull { it.userId == user.id }
        assertNull(expectedMember)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should remove vault invitation by invited user`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)
        val user = createUserAndAuthenticate(userCreateRequest = createUserCreateRequest(email = "henry@app.com"))
        val invitation = createVaultInvitation(vault.id, token.userId, user.email)

        // when
        val response = Unirest.delete("/vaults/${vault.id}/invitations/${invitation.userEmail}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asEmpty()

        // then
        val expectedInvitation = vaultInvitationRepository.findByVaultId(vault.id).firstOrNull { it.userEmail == user.email }
        assertNull(expectedInvitation)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

}