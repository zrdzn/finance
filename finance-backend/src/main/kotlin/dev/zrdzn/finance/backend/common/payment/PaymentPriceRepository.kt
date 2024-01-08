package dev.zrdzn.finance.backend.common.payment

interface PaymentPriceRepository {

    fun save(paymentPrice: PaymentPrice): PaymentPrice

}