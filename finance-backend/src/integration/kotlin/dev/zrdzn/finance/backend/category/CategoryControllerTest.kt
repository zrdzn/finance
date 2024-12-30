package dev.zrdzn.finance.backend.category

import dev.zrdzn.finance.backend.authentication.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.category.api.CategoryCreateRequest
import dev.zrdzn.finance.backend.category.api.CategoryListResponse
import dev.zrdzn.finance.backend.category.api.CategoryResponse
import dev.zrdzn.finance.backend.transaction.api.TransactionMethod
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class CategoryControllerTest : CategorySpecification() {

    @Test
    fun `should create category`() {
        // given
        val token = createUserAndAuthenticate()

        val vaultName = "Test vault"
        val vaultCurrency = "PLN"
        val vaultDefaultTransactionMethod = TransactionMethod.CARD
        val vault = createVault(
            ownerId = token.userId,
            name = vaultName,
            currency = vaultCurrency,
            defaultTransactionMethod = vaultDefaultTransactionMethod
        )

        val name = "Test category"

        val request = CategoryCreateRequest(
            vaultId = vault.id,
            name = name
        )

        // when
        val response = Unirest.post("/categories/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(CategoryResponse::class.java)

        // then
        val expectedCategory = categoryRepository.findById(response.body.id)
        assertNotNull(expectedCategory)
        assertEquals(vault.id, expectedCategory!!.vaultId)
        assertEquals(name, expectedCategory.name)

        assertNotNull(response.body)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should delete category`() {
        // given
        val token = createUserAndAuthenticate()

        val vaultName = "Test vault"
        val vaultCurrency = "PLN"
        val vaultDefaultTransactionMethod = TransactionMethod.CARD
        val vault = createVault(
            ownerId = token.userId,
            name = vaultName,
            currency = vaultCurrency,
            defaultTransactionMethod = vaultDefaultTransactionMethod
        )

        val name = "Test category"

        val category = createCategory(
            requesterId = token.userId,
            vaultId = vault.id,
            name = name
        )

        // when
        val response = Unirest.delete("/categories/${category.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asEmpty()

        // then
        val expectedCategory = categoryRepository.findById(category.id)
        assertNull(expectedCategory)

        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should get category by id`() {
        // given
        val token = createUserAndAuthenticate()

        val vaultName = "Test vault"
        val vaultCurrency = "PLN"
        val vaultDefaultTransactionMethod = TransactionMethod.CARD
        val vault = createVault(
            ownerId = token.userId,
            name = vaultName,
            currency = vaultCurrency,
            defaultTransactionMethod = vaultDefaultTransactionMethod
        )

        val name = "Test category"

        val category = createCategory(
            requesterId = token.userId,
            vaultId = vault.id,
            name = name
        )

        // when
        val response = Unirest.get("/categories/${category.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(CategoryResponse::class.java)

        // then
        assertNotNull(response.body)
        assertEquals(category.id, response.body.id)
        assertEquals(vault.id, response.body.vaultId)
        assertEquals(name, response.body.name)
    }

    @Test
    fun `should get categories by vault id`() {
        // given
        val token = createUserAndAuthenticate()

        val vaultName = "Test vault"
        val vaultCurrency = "PLN"
        val vaultDefaultTransactionMethod = TransactionMethod.CARD
        val vault = createVault(
            ownerId = token.userId,
            name = vaultName,
            currency = vaultCurrency,
            defaultTransactionMethod = vaultDefaultTransactionMethod
        )

        val name = "Test category"

        val category = createCategory(
            requesterId = token.userId,
            vaultId = vault.id,
            name = name
        )

        // when
        val response = Unirest.get("/categories/vault/${vault.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(CategoryListResponse::class.java)

        // then
        val expectedCategory = response.body.categories.firstOrNull()
        assertNotNull(expectedCategory)
        assertEquals(category.id, expectedCategory!!.id)

        assertEquals(HttpStatus.OK.value(), response.status)
    }

}