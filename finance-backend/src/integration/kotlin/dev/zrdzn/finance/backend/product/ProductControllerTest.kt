package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.token.domain.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.product.application.request.ProductCreateRequest
import dev.zrdzn.finance.backend.product.application.response.ProductListResponse
import dev.zrdzn.finance.backend.product.application.response.ProductResponse
import dev.zrdzn.finance.backend.product.application.request.ProductUpdateRequest
import dev.zrdzn.finance.backend.transaction.domain.TransactionMethod
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class ProductControllerTest : ProductSpecification() {

    @Test
    fun `should create product without category`() {
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

        val name = "Test product"

        val request = ProductCreateRequest(
            vaultId = vault.id,
            name = name,
            categoryId = null
        )

        // when
        val response = Unirest.post("/products/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(ProductResponse::class.java)

        // then
        val expectedProduct = productRepository.findById(response.body.id)
        assertNotNull(expectedProduct)
        assertEquals(vault.id, expectedProduct!!.vaultId)
        assertEquals(name, expectedProduct.name)
        assertNull(expectedProduct.categoryId)

        assertNotNull(response.body)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should create product with category`() {
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

        val name = "Test product"

        val category = createCategory(
            requesterId = token.userId,
            vaultId = vault.id,
            name = "Test category"
        )

        val request = ProductCreateRequest(
            vaultId = vault.id,
            name = name,
            categoryId = category.id
        )

        // when
        val response = Unirest.post("/products/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(ProductResponse::class.java)

        // then
        val expectedProduct = productRepository.findById(response.body.id)
        assertNotNull(expectedProduct)
        assertEquals(vault.id, expectedProduct!!.vaultId)
        assertEquals(name, expectedProduct.name)
        assertEquals(category.id, expectedProduct.categoryId)

        assertNotNull(response.body)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should update product`() {
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

        val name = "Test product"

        val product = createProduct(
            requesterId = token.userId,
            vaultId = vault.id,
            name = name,
            categoryId = null
        )

        val newCategoryId = createCategory(
            requesterId = token.userId,
            vaultId = vault.id,
            name = "Test category"
        ).id

        val request = ProductUpdateRequest(
            categoryId = newCategoryId
        )

        // when
        val response = Unirest.patch("/products/${product.id}")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asEmpty()

        // then
        val expectedProduct = productRepository.findById(product.id)
        assertNotNull(expectedProduct)
        assertEquals(vault.id, expectedProduct!!.vaultId)
        assertEquals(newCategoryId, expectedProduct.categoryId)
        assertNotNull(expectedProduct.categoryId)

        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should delete product`() {
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

        val name = "Test product"

        val product = createProduct(
            requesterId = token.userId,
            vaultId = vault.id,
            name = name,
            categoryId = null
        )

        // when
        val response = Unirest.delete("/products/${product.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asEmpty()

        // then
        val expectedProduct = productRepository.findById(product.id)
        assertNull(expectedProduct)

        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should get products`() {
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

        val name = "Test product"

        val product = createProduct(
            requesterId = token.userId,
            vaultId = vault.id,
            name = name,
            categoryId = null
        )

        // when
        val response = Unirest.get("/products/${vault.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(ProductListResponse::class.java)

        // then
        val expectedProduct = response.body.products.firstOrNull()
        assertNotNull(expectedProduct)
        assertEquals(product.id, expectedProduct!!.id)
        assertEquals(vault.id, expectedProduct.vaultId)
        assertEquals(name, expectedProduct.name)
        assertNull(expectedProduct.categoryId)
    }

}