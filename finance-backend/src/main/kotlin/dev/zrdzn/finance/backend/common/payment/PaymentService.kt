package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.api.payment.PaymentAverageExpensesResponse
import dev.zrdzn.finance.backend.api.payment.PaymentCreateResponse
import dev.zrdzn.finance.backend.api.payment.PaymentExpenseRange
import dev.zrdzn.finance.backend.api.payment.PaymentExpensesResponse
import dev.zrdzn.finance.backend.api.payment.PaymentListResponse
import dev.zrdzn.finance.backend.api.payment.PaymentMethod
import dev.zrdzn.finance.backend.api.payment.PaymentProductCreateResponse
import dev.zrdzn.finance.backend.api.payment.PaymentProductListResponse
import dev.zrdzn.finance.backend.api.payment.PaymentProductWithProductResponse
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

class PaymentService(
    private val paymentRepository: PaymentRepository,
    private val paymentProductRepository: PaymentProductRepository,
    private val productService: ProductService,
    private val exchangeService: ExchangeService
) {

    private val logger = LoggerFactory.getLogger(PaymentService::class.java)

    fun createPayment(
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

    fun createPaymentProduct(paymentId: PaymentId, productId: ProductId, unitAmount: BigDecimal, quantity: Int): PaymentProductCreateResponse =
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


    fun getPaymentsByVaultId(vaultId: VaultId): PaymentListResponse =
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
                    total = it.total,
                    currency = it.currency
                )
            }
            .toSet()
            .let { PaymentListResponse(it)}

    fun getPaymentProducts(paymentId: PaymentId): PaymentProductListResponse =
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

    fun getPaymentExpenses(vaultId: VaultId, currency: Currency, start: Instant): PaymentExpensesResponse =
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

    fun getPaymentAverageExpenses(vaultId: VaultId, currency: Currency, range: PaymentExpenseRange): PaymentAverageExpensesResponse {
        val totalExpenses = paymentRepository.sumAndGroupExpensesByVaultId(vaultId)

        val convertedTotal = totalExpenses.sumOf {
            exchangeService.convertCurrency(
                amount = it.amount,
                source = it.currency,
                target = currency
            ).amount
        }

        val totalDays = paymentRepository.countTotalDaysByVaultId(vaultId).toBigDecimal()

        // make sure we don't divide by zero
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