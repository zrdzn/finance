package dev.zrdzn.finance.backend.common.payment

interface PaymentRepository {

    fun save(payment: Payment): Payment

}