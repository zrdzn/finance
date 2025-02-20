package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.error.FinanceApiError
import dev.zrdzn.finance.backend.token.domain.TOKEN_COOKIE_NAME
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.transaction.application.response.TransactionAmountResponse
import dev.zrdzn.finance.backend.transaction.application.request.TransactionCreateRequest
import dev.zrdzn.finance.backend.transaction.application.response.TransactionListResponse
import dev.zrdzn.finance.backend.transaction.domain.TransactionMethod
import dev.zrdzn.finance.backend.transaction.application.response.TransactionResponse
import dev.zrdzn.finance.backend.transaction.domain.TransactionType
import dev.zrdzn.finance.backend.transaction.application.request.TransactionProductCreateRequest
import dev.zrdzn.finance.backend.transaction.application.response.TransactionProductListResponse
import dev.zrdzn.finance.backend.transaction.application.response.TransactionProductResponse
import dev.zrdzn.finance.backend.transaction.application.request.ScheduleCreateRequest
import dev.zrdzn.finance.backend.transaction.domain.ScheduleInterval
import dev.zrdzn.finance.backend.transaction.application.response.ScheduleResponse
import java.math.BigDecimal
import kong.unirest.core.Unirest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
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
            currency = currency
        )

        // when
        val response = Unirest.post("/transaction/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(TransactionResponse::class.java)

        // then
        val expectedTransaction = transactionRepository.findById(response.body.id)
        assertNotNull(expectedTransaction)
        assertEquals(vault.id, expectedTransaction!!.vaultId)
        assertEquals(transactionMethod, expectedTransaction.transactionMethod)
        assertEquals(transactionType, expectedTransaction.transactionType)
        assertEquals(description, expectedTransaction.description)
        assertEquals(price, expectedTransaction.total)
        assertEquals(currency, expectedTransaction.currency)

        assertNotNull(response.body)
        assertEquals(HttpStatus.OK.value(), response.status)
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
            currency = currency
        )

        // when
        val response = Unirest.post("/transaction/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(FinanceApiError::class.java)

        // then
        assertNotNull(response.body)
        assertEquals(response.body.status, HttpStatus.BAD_REQUEST.value())
        assertEquals(HttpStatus.BAD_REQUEST.value(), response.status)
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

        val product = createProduct(
            requesterId = token.userId,
            vaultId = vault.id,
            name = "Test product",
            categoryId = null
        )

        val unitAmount = BigDecimal("1.00")
        val quantity = 5

        val request = TransactionProductCreateRequest(
            productId = product.id,
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
        val expectedTransactionProduct = transactionProductRepository.findById(response.body.id)
        assertNotNull(expectedTransactionProduct)
        assertEquals(transaction.id, expectedTransactionProduct!!.transactionId)
        assertEquals(product.id, expectedTransactionProduct.productId)
        assertEquals(unitAmount, expectedTransactionProduct.unitAmount)
        assertEquals(quantity, expectedTransactionProduct.quantity)

        assertNotNull(response.body)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

    @Test
    fun `should create schedule`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        val transaction = createTransaction(
            requesterId = token.userId,
            vaultId = vault.id
        )

        val description = "Test schedule"
        val interval = ScheduleInterval.DAY
        val amount = 10

        val request = ScheduleCreateRequest(
            description = description,
            interval = interval,
            amount = amount
        )

        // when
        val response = Unirest.post("/transactions/${transaction.id}/schedule/create")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asObject(ScheduleResponse::class.java)

        // then
        val expectedSchedule = scheduleRepository.findById(response.body.id)
        assertNotNull(expectedSchedule)
        assertEquals(transaction.id, expectedSchedule!!.transactionId)
        assertEquals(description, expectedSchedule.description)
        assertEquals(interval, expectedSchedule.scheduleInterval)
        assertEquals(amount, expectedSchedule.intervalValue)

        assertNotNull(response.body)
        assertEquals(HttpStatus.OK.value(), response.status)
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
    fun `should delete schedule by id`() {
        // given
        val token = createUserAndAuthenticate()
        val vault = createVault(token.userId)

        val transaction = createTransaction(
            requesterId = token.userId,
            vaultId = vault.id
        )

        val schedule = createSchedule(
            requesterId = token.userId,
            transactionId = transaction.id
        )

        // when
        val response = Unirest.delete("/transactions/${transaction.id}/schedule/${schedule.id}")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asEmpty()

        // then
        val expectedSchedule = scheduleRepository.findById(schedule.id)
        assertNull(expectedSchedule)

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
            .asObject(FinanceApiError::class.java)

        // then
        assertNotNull(response.body)
        assertEquals(response.body.status, HttpStatus.FORBIDDEN.value())
        assertEquals(HttpStatus.FORBIDDEN.value(), response.status)
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

        val product = createProduct(
            requesterId = token.userId,
            vaultId = vault.id,
            name = "Test product",
            categoryId = null
        )

        val unitAmount = BigDecimal("1.00")
        val quantity = 5

        createTransactionProduct(
            transactionId = transaction.id,
            productId = product.id,
            unitAmount = unitAmount,
            quantity = quantity,
            requesterId = token.userId
        )

        // when
        val response = Unirest.get("/transactions/${transaction.id}/products")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .asObject(TransactionProductListResponse::class.java)

        // then
        val expectedTransactionProduct = response.body.products.firstOrNull()
        assertNotNull(expectedTransactionProduct)
        assertEquals(transaction.id, expectedTransactionProduct!!.transactionId)
        assertEquals(product.id, expectedTransactionProduct.product.id)
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

        val request = TransactionCreateRequest(
            vaultId = vault.id,
            transactionMethod = transactionMethod,
            transactionType = transactionType,
            description = newDescription,
            price = newPrice.amount,
            currency = newPrice.currency
        )

        // when
        val response = Unirest.patch("/transactions/${transaction.id}")
            .contentType("application/json")
            .cookie(TOKEN_COOKIE_NAME, token.value)
            .body(request)
            .asEmpty()

        // then
        val expectedTransaction = transactionRepository.findById(transaction.id)
        assertNotNull(expectedTransaction)
        assertEquals(vault.id, expectedTransaction!!.vaultId)
        assertEquals(transactionMethod, expectedTransaction.transactionMethod)
        assertEquals(transactionType, expectedTransaction.transactionType)
        assertEquals(newDescription, expectedTransaction.description)
        assertEquals(newPrice.amount, expectedTransaction.total)
        assertEquals(newPrice.currency, expectedTransaction.currency)

        assertNotNull(response.body)
        assertEquals(HttpStatus.OK.value(), response.status)
    }

}