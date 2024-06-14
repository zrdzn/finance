package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.api.payment.expense.PaymentAverageExpensesResponse
import dev.zrdzn.finance.backend.api.payment.PaymentCreateResponse
import dev.zrdzn.finance.backend.api.payment.expense.PaymentExpenseRange
import dev.zrdzn.finance.backend.api.payment.expense.PaymentExpensesResponse
import dev.zrdzn.finance.backend.api.payment.PaymentListResponse
import dev.zrdzn.finance.backend.api.payment.PaymentMethod
import dev.zrdzn.finance.backend.api.payment.PaymentNotFoundException
import dev.zrdzn.finance.backend.api.payment.product.PaymentProductCreateResponse
import dev.zrdzn.finance.backend.api.payment.product.PaymentProductListResponse
import dev.zrdzn.finance.backend.api.payment.product.PaymentProductWithProductResponse
import dev.zrdzn.finance.backend.api.payment.PaymentResponse
import dev.zrdzn.finance.backend.api.price.Price
import dev.zrdzn.finance.backend.api.shared.Currency
import dev.zrdzn.finance.backend.common.exchange.ExchangeService
import dev.zrdzn.finance.backend.common.product.ProductId
import dev.zrdzn.finance.backend.common.product.ProductService
import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.vault.VaultId
import java.math.BigDecimal
import java.time.Instant
import org.slf4j.LoggerFactory
import org.springframework.transaction.annotation.Transactional

open class PaymentService(
    private val paymentRepository: PaymentRepository,
    private val paymentProductRepository: PaymentProductRepository,
    private val productService: ProductService,
    private val exchangeService: ExchangeService
) {

    private val logger = LoggerFactory.getLogger(PaymentService::class.java)

    @Transactional
    open fun createPayment(
        userId: UserId,
        vaultId: VaultId,
        paymentMethod: PaymentMethod,
        description: String?,
        price: Price
    ): PaymentCreateResponse =
        paymentRepository
            .save(
                Payment(
                    id = null,
                    userId = userId,
                    vaultId = vaultId,
                    payedAt = Instant.now(),
                    paymentMethod = paymentMethod,
                    description = description,
                    total = price.amount,
                    currency = price.currency
                )
            )
            .also { logger.info("Successfully created new payment: $it") }
            .let { PaymentCreateResponse(id = it.id!!) }

    @Transactional
    open fun createPaymentProduct(paymentId: PaymentId, productId: ProductId, unitAmount: BigDecimal, quantity: Int): PaymentProductCreateResponse =
        paymentProductRepository
            .save(
                PaymentProduct(
                    id = null,
                    paymentId = paymentId,
                    productId = productId,
                    unitAmount = unitAmount,
                    quantity = quantity,
                )
            )
            .also { logger.info("Successfully created new payment product: $it") }
            .let { PaymentProductCreateResponse(id = it.id!!) }

    @Transactional
    open fun updatePayment(paymentId: PaymentId, paymentMethod: PaymentMethod, description: String?, price: Price) {
        val payment = paymentRepository.findById(paymentId) ?: throw PaymentNotFoundException(paymentId)
        payment.paymentMethod = paymentMethod
        payment.description = description
        payment.total = price.amount
        payment.currency = price.currency
        logger.info("Successfully updated payment: $payment")
    }

    @Transactional
    open fun deletePayment(paymentId: PaymentId): Unit =
        paymentRepository.deleteById(paymentId)
            .also { logger.info("Successfully deleted payment with id: $paymentId") }

    @Transactional(readOnly = true)
    open fun getPaymentsByVaultId(vaultId: VaultId): PaymentListResponse =
        paymentRepository
            .findByVaultId(vaultId)
            .map {
                PaymentResponse(
                    id = it.id!!,
                    userId = it.userId,
                    vaultId = it.vaultId,
                    payedAt = it.payedAt.toString(),
                    paymentMethod = it.paymentMethod,
                    description = it.description,
                    totalInVaultCurrency = exchangeService.convertCurrency(
                        amount = it.total,
                        source = it.currency,
                        target = "PLN"
                    ).amount,
                    total = it.total,
                    currency = it.currency
                )
            }
            .toSet()
            .let { PaymentListResponse(it)}

    @Transactional(readOnly = true)
    open fun getPaymentProducts(paymentId: PaymentId): PaymentProductListResponse =
        paymentProductRepository
            .findByPaymentId(paymentId)
            .map {
                PaymentProductWithProductResponse(
                    id = it.id!!,
                    paymentId = it.paymentId,
                    product = productService.getProductById(it.productId),
                    unitAmount = it.unitAmount,
                    quantity = it.quantity
                )
            }
            .toSet()
            .let { PaymentProductListResponse(it) }

    @Transactional(readOnly = true)
    open fun getPaymentExpenses(vaultId: VaultId, currency: Currency, start: Instant): PaymentExpensesResponse =
        paymentRepository.sumAndGroupExpensesByVaultId(vaultId, start)
            .sumOf {
                exchangeService.convertCurrency(
                    amount = it.amount,
                    source = it.currency,
                    target = currency
                ).amount
            }
            .let {
                PaymentExpensesResponse(
                    Price(
                        amount = it,
                        currency = currency
                    )
                )
            }

    @Transactional(readOnly = true)
    open fun getPaymentAverageExpenses(vaultId: VaultId, currency: Currency, range: PaymentExpenseRange): PaymentAverageExpensesResponse {
        val totalExpenses = paymentRepository.sumAndGroupExpensesByVaultId(vaultId)

        val convertedTotal = totalExpenses.sumOf {
            exchangeService.convertCurrency(
                amount = it.amount,
                source = it.currency,
                target = currency
            ).amount
        }

        val totalDays = paymentRepository.countTotalDaysByVaultId(vaultId).toBigDecimal()

        val dailyAverageAmount = convertedTotal / totalDays

        val averageAmount: BigDecimal = when (range) {
            PaymentExpenseRange.DAY -> dailyAverageAmount
            PaymentExpenseRange.WEEK -> dailyAverageAmount / 7.toBigDecimal()
            PaymentExpenseRange.MONTH -> dailyAverageAmount / 30.toBigDecimal()
            PaymentExpenseRange.YEAR -> dailyAverageAmount / 365.toBigDecimal()
        }

        return PaymentAverageExpensesResponse(
            Price(
                amount = averageAmount,
                currency = currency
            )
        )
    }

}