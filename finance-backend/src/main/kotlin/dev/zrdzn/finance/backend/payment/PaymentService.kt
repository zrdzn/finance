package dev.zrdzn.finance.backend.payment

import dev.zrdzn.finance.backend.exchange.ExchangeService
import dev.zrdzn.finance.backend.payment.api.PaymentCreateResponse
import dev.zrdzn.finance.backend.payment.api.PaymentListResponse
import dev.zrdzn.finance.backend.payment.api.PaymentMethod
import dev.zrdzn.finance.backend.payment.api.PaymentNotFoundException
import dev.zrdzn.finance.backend.payment.api.PaymentResponse
import dev.zrdzn.finance.backend.payment.api.expense.PaymentAverageExpensesResponse
import dev.zrdzn.finance.backend.payment.api.expense.PaymentExpenseRange
import dev.zrdzn.finance.backend.payment.api.expense.PaymentExpensesResponse
import dev.zrdzn.finance.backend.payment.api.product.PaymentProductCreateResponse
import dev.zrdzn.finance.backend.payment.api.product.PaymentProductListResponse
import dev.zrdzn.finance.backend.payment.api.product.PaymentProductWithProductResponse
import dev.zrdzn.finance.backend.product.ProductId
import dev.zrdzn.finance.backend.product.ProductService
import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.shared.Price
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import dev.zrdzn.finance.backend.vault.VaultService
import dev.zrdzn.finance.backend.vault.api.VaultPermission
import java.math.BigDecimal
import java.time.Instant
import org.slf4j.LoggerFactory
import org.springframework.transaction.annotation.Transactional

open class PaymentService(
    private val paymentRepository: PaymentRepository,
    private val paymentProductRepository: PaymentProductRepository,
    private val productService: ProductService,
    private val exchangeService: ExchangeService,
    private val vaultService: VaultService
) {

    private val logger = LoggerFactory.getLogger(PaymentService::class.java)

    @Transactional
    open fun createPayment(
        requesterId: UserId,
        vaultId: VaultId,
        paymentMethod: PaymentMethod,
        description: String?,
        price: Price
    ): PaymentCreateResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.PAYMENT_CREATE)

        return paymentRepository
            .save(
                Payment(
                    id = null,
                    userId = requesterId,
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
    }

    @Transactional
    open fun createPaymentProduct(
        requesterId: UserId,
        paymentId: PaymentId,
        productId: ProductId,
        unitAmount: BigDecimal,
        quantity: Int
    ): PaymentProductCreateResponse {
        val product = productService.getProductById(requesterId, productId)

        vaultService.authorizeMember(product.vaultId, requesterId, VaultPermission.PAYMENT_CREATE)

        return paymentProductRepository
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
    }

    @Transactional
    open fun updatePayment(requesterId: UserId, paymentId: PaymentId, paymentMethod: PaymentMethod, description: String?, price: Price) {
        val payment = paymentRepository.findById(paymentId) ?: throw PaymentNotFoundException(paymentId)

        vaultService.authorizeMember(payment.vaultId, requesterId, VaultPermission.PAYMENT_UPDATE)

        payment.paymentMethod = paymentMethod
        payment.description = description
        payment.total = price.amount
        payment.currency = price.currency
        logger.info("Successfully updated payment: $payment")
    }

    @Transactional
    open fun deletePayment(paymentId: PaymentId) {
        val payment = paymentRepository.findById(paymentId) ?: throw PaymentNotFoundException(paymentId)

        vaultService.authorizeMember(payment.vaultId, payment.userId, VaultPermission.PAYMENT_DELETE)

        paymentRepository.deleteById(paymentId)
            .also { logger.info("Successfully deleted payment with id: $paymentId") }
    }

    @Transactional(readOnly = true)
    open fun getPaymentsByVaultId(requesterId: UserId, vaultId: VaultId): PaymentListResponse =
        paymentRepository
            .findByVaultId(vaultId)
            .map {
                vaultService.authorizeMember(vaultId, it.userId, VaultPermission.PAYMENT_READ)

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
            .let { PaymentListResponse(it) }

    @Transactional(readOnly = true)
    open fun getPaymentProducts(requesterId: UserId, paymentId: PaymentId): PaymentProductListResponse {
        val payment = paymentRepository.findById(paymentId) ?: throw PaymentNotFoundException(paymentId)

        vaultService.authorizeMember(payment.vaultId, requesterId, VaultPermission.PAYMENT_READ)

        return paymentProductRepository
            .findByPaymentId(paymentId)
            .map {
                PaymentProductWithProductResponse(
                    id = it.id!!,
                    paymentId = it.paymentId,
                    product = productService.getProductById(requesterId, it.productId),
                    unitAmount = it.unitAmount,
                    quantity = it.quantity
                )
            }
            .toSet()
            .let { PaymentProductListResponse(it) }
    }

    @Transactional(readOnly = true)
    open fun getPaymentExpenses(requesterId: UserId, vaultId: VaultId, currency: Currency, start: Instant): PaymentExpensesResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.DETAILS_READ)

        return paymentRepository.sumAndGroupExpensesByVaultId(vaultId, start)
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
    }

    @Transactional(readOnly = true)
    open fun getPaymentAverageExpenses(
        requesterId: UserId,
        vaultId: VaultId,
        currency: Currency,
        range: PaymentExpenseRange
    ): PaymentAverageExpensesResponse {
        vaultService.authorizeMember(vaultId, requesterId, VaultPermission.DETAILS_READ)

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