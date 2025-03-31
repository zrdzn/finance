package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.token.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.transaction.dto.TransactionAmountResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionCreateRequest
import dev.zrdzn.finance.backend.transaction.dto.TransactionListResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionProductCreateRequest
import dev.zrdzn.finance.backend.transaction.dto.TransactionProductResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionUpdateRequest
import java.math.BigDecimal
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class TransactionControllerTest : TransactionSpecification() {

    @Test
    fun `should create transaction`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        val transactionMethod = TransactionMethod.CARD
        val transactionType = TransactionType.INCOMING
        val description = "Test transaction"
        val price = BigDecimal("100.00")
        val currency = "PLN"

        val request = TransactionCreateRequest(
            vaultId = vault.id,
            transactionMethod = transactionMethod,
            transactionType = transactionType,
            description = description,
            price = price,
            currency = currency,
            products = emptySet(),
        )

        // when
        val response = Unirest.post("/transactions/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(TransactionResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), response.status)
        assertNotNull(response.body)

        val expectedTransaction = transactionRepository.findById(response.body.id)
        assertNotNull(expectedTransaction)
        assertEquals(vault.id, expectedTransaction!!.vaultId)
        assertEquals(transactionMethod, expectedTransaction.transactionMethod)
        assertEquals(transactionType, expectedTransaction.transactionType)
        assertEquals(description, expectedTransaction.description)
        assertEquals(price, expectedTransaction.total)
        assertEquals(currency, expectedTransaction.currency)
    }

    @Test
    fun `should not create transaction with empty description`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        val transactionMethod = TransactionMethod.CARD
        val transactionType = TransactionType.INCOMING
        val description = ""
        val price = BigDecimal("100.00")
        val currency = "PLN"

        val request = TransactionCreateRequest(
            vaultId = vault.id,
            transactionMethod = transactionMethod,
            transactionType = transactionType,
            description = description,
            price = price,
            currency = currency,
            products = emptySet(),
        )

        // when
        val response = Unirest.post("/transactions/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asString()

        // then
        assertNotNull(response.body)
        assertEquals(HttpStatus.BAD_REQUEST.value(), response.status)
        assertTrue(response.containsError(HttpStatus.BAD_REQUEST))
    }

    @Test
    fun `should create transaction product`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        val transaction = createTransaction(
            requesterId = token.userId,
            vaultId = vault.id
        )

        val name = "Test product"
        val unitAmount = BigDecimal("1.00")
        val quantity = 5

        val request = TransactionProductCreateRequest(
            name = name,
            categoryId = null,
            unitAmount = unitAmount,
            quantity = quantity
        )

        // when
        val response = Unirest.post("/transactions/${transaction.id}/products/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(TransactionProductResponse::class.java)

        // then
        assertEquals(HttpStatus.OK.value(), response.status)
        assertNotNull(response.body)

        val expectedTransactionProduct = transactionProductRepository.findById(response.body.id)
        assertNotNull(expectedTransactionProduct)
        assertEquals(transaction.id, expectedTransactionProduct!!.transactionId)
        assertEquals(name, expectedTransactionProduct.name)
        assertEquals(unitAmount, expectedTransactionProduct.unitAmount)
        assertEquals(quantity, expectedTransactionProduct.quantity)
    }

    @Test
    fun `should delete transaction`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        val transaction = createTransaction(
            requesterId = token.userId,
            vaultId = vault.id
        )

        // when
        val response = Unirest.delete("/transactions/${transaction.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asEmpty()

        // then
        val expectedTransaction = transactionRepository.findById(transaction.id)
        assertNull(expectedTransaction)

        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should get transactions by vault id`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        val transactionMethod = TransactionMethod.CARD
        val transactionType = TransactionType.INCOMING
        val description = "Test transaction"
        val price = Price(
            amount = BigDecimal("100.00"),
            currency = "PLN"
        )

        val transaction = createTransaction(
            requesterId = token.userId,
            vaultId = vault.id
        )

        // when
        val response = Unirest.get("/transactions/${vault.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(TransactionListResponse::class.java)

        // then
        val expectedTransaction = response.body.transactions.firstOrNull()
        assertNotNull(expectedTransaction)
        assertEquals(transaction.id, expectedTransaction!!.id)
        assertEquals(vault.id, expectedTransaction.vaultId)
        assertEquals(transactionMethod, expectedTransaction.transactionMethod)
        assertEquals(transactionType, expectedTransaction.transactionType)
        assertEquals(description, expectedTransaction.description)
        assertEquals(price.amount, expectedTransaction.total)
        assertEquals(price.currency, expectedTransaction.currency)
    }

    @Test
    fun `should not get transactions by vault id with invalid vault id`() {
        // given
        val token = createUserAndAuthenticate()

        // when
        val response = Unirest.get("/transactions/0")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asString()

        // then
        assertNotNull(response.body)
        assertEquals(HttpStatus.FORBIDDEN.value(), response.status)
        assertTrue(response.containsError(HttpStatus.FORBIDDEN))
    }

    @Test
    fun `should get transactions amount by vault id`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        createTransaction(
            requesterId = token.userId,
            vaultId = vault.id
        )

        createTransaction(
            requesterId = token.userId,
            vaultId = vault.id
        )

        // when
        val response = Unirest.get("/transactions/${vault.id}/amount")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(TransactionAmountResponse::class.java)

        // then
        assertEquals(2, response.body.amount)
    }

    @Test
    fun `should get transaction products by transaction id`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)
        val transaction = createTransaction(
            requesterId = token.userId,
            vaultId = vault.id
        )

        val name = "Test product"
        val unitAmount = BigDecimal("1.00")
        val quantity = 5

        createTransactionProduct(
            transactionId = transaction.id,
            name = name,
            unitAmount = unitAmount,
            quantity = quantity,
            requesterId = token.userId
        )

        // when
        val response = Unirest.get("/transactions/${vault.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(TransactionListResponse::class.java)

        // then
        val expectedTransactionProduct = response.body.transactions.first().products.products.firstOrNull()
        assertNotNull(expectedTransactionProduct)
        assertEquals(transaction.id, expectedTransactionProduct!!.transactionId)
        assertEquals(name, expectedTransactionProduct.name)
        assertEquals(unitAmount, expectedTransactionProduct.unitAmount)
        assertEquals(quantity, expectedTransactionProduct.quantity)
    }

    @Test
    fun `should update transaction`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)
        val transaction = createTransaction(
            requesterId = token.userId,
            vaultId = vault.id
        )

        val transactionMethod = TransactionMethod.CARD
        val transactionType = TransactionType.INCOMING

        val newDescription = "Updated description"
        val newPrice = Price(
            amount = BigDecimal("200.00"),
            currency = "PLN"
        )

        val request = TransactionUpdateRequest(
            transactionMethod = transactionMethod,
            transactionType = transactionType,
            description = newDescription,
            total = newPrice.amount,
            currency = newPrice.currency
        )

        // when
        val response = Unirest.patch("/transactions/${transaction.id}")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asEmpty()

        // then
        assertEquals(HttpStatus.OK.value(), response.status)

        val expectedTransaction = transactionRepository.findById(transaction.id)
        assertNotNull(expectedTransaction)
        assertEquals(vault.id, expectedTransaction!!.vaultId)
        assertEquals(transactionMethod, expectedTransaction.transactionMethod)
        assertEquals(transactionType, expectedTransaction.transactionType)
        assertEquals(newDescription, expectedTransaction.description)
        assertEquals(newPrice.amount, expectedTransaction.total)
        assertEquals(newPrice.currency, expectedTransaction.currency)
    }

}