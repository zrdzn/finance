package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.common.vault.VaultSpecification

open class PaymentSpecification : VaultSpecification() {

    protected val paymentService: PaymentService get() = application.getBean(PaymentService::class.java)

}