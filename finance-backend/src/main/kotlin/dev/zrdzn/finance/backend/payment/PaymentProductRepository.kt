package dev.zrdzn.finance.backend.payment

interface PaymentProductRepository {

    fun save(paymentProduct: PaymentProduct): PaymentProduct

    fun findByPaymentId(paymentId: PaymentId): Set<PaymentProduct>

}