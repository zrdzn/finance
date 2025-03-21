package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.product.dto.ProductCreateRequest
import dev.zrdzn.finance.backend.product.dto.ProductListResponse
import dev.zrdzn.finance.backend.product.dto.ProductResponse
import dev.zrdzn.finance.backend.product.dto.ProductUpdateRequest
import dev.zrdzn.finance.backend.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.transaction.TransactionMethod
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
        val unitAmount = 1.00.toBigDecimal()

        val request = ProductCreateRequest(
            vaultId = vault.id,
            name = name,
            categoryId = null,
            unitAmount = unitAmount
        )

        // when
        val response = Unirest.post("/products/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(ProductResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), response.status)
        assertNotNull(response.body)

        val expectedProduct = productRepository.findById(response.body.id)
        assertNotNull(expectedProduct)
        assertEquals(vault.id, expectedProduct!!.vaultId)
        assertEquals(name, expectedProduct.name)
        assertNull(expectedProduct.categoryId)
        assertEquals(getPricesDifference(expectedProduct.unitAmount, unitAmount), 0)
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
        val unitAmount = 1.00.toBigDecimal()

        val category = createCategory(
            requesterId = token.userId,
            vaultId = vault.id,
            name = "Test category"
        )

        val request = ProductCreateRequest(
            vaultId = vault.id,
            name = name,
            categoryId = category.id,
            unitAmount = unitAmount
        )

        // when
        val response = Unirest.post("/products/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(ProductResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), response.status)
        assertNotNull(response.body)

        val expectedProduct = productRepository.findById(response.body.id)
        assertNotNull(expectedProduct)
        assertEquals(vault.id, expectedProduct!!.vaultId)
        assertEquals(name, expectedProduct.name)
        assertEquals(category.id, expectedProduct.categoryId)
        assertEquals(getPricesDifference(expectedProduct.unitAmount, unitAmount), 0)
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
        val unitAmount = 1.00.toBigDecimal()

        val product = createProduct(
            requesterId = token.userId,
            vaultId = vault.id,
            name = name,
            categoryId = null,
            unitAmount = unitAmount
        )

        val newCategoryId = createCategory(
            requesterId = token.userId,
            vaultId = vault.id,
            name = "Test category"
        ).id

        val request = ProductUpdateRequest(
            categoryId = newCategoryId,
            unitAmount = unitAmount
        )

        // when
        val response = Unirest.patch("/products/${product.id}")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asEmpty()

        // then
        assertEquals(HttpStatus.OK.value(), response.status)

        val expectedProduct = productRepository.findById(product.id)
        assertNotNull(expectedProduct)
        assertEquals(vault.id, expectedProduct!!.vaultId)
        assertEquals(newCategoryId, expectedProduct.categoryId)
        assertNotNull(expectedProduct.categoryId)
        assertEquals(getPricesDifference(expectedProduct.unitAmount, unitAmount), 0)
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
        val unitAmount = 1.00.toBigDecimal()

        val product = createProduct(
            requesterId = token.userId,
            vaultId = vault.id,
            name = name,
            categoryId = null,
            unitAmount = unitAmount
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
        val unitAmount = 1.00.toBigDecimal()

        val product = createProduct(
            requesterId = token.userId,
            vaultId = vault.id,
            name = name,
            categoryId = null,
            unitAmount = unitAmount
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
        assertNull(expectedProduct.category)
    }

}