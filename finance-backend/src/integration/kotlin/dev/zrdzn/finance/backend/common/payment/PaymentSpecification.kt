package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.common.authentication.AuthenticationSpecification

open class PaymentSpecification : AuthenticationSpecification() {

    protected val paymentService: PaymentService get() = application.getBean(PaymentService::class.java)

}