package dev.zrdzn.finance.backend.common.payment

interface PaymentProductRepository {

    fun save(paymentProduct: PaymentProduct): PaymentProduct

    fun findByPaymentId(paymentId: PaymentId): Set<PaymentProduct>

}