package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.common.authentication.AuthenticationSpecification
import org.springframework.beans.factory.annotation.Autowired

class PaymentSpecification : AuthenticationSpecification() {

    @Autowired
    protected lateinit var paymentFacade: PaymentFacade

}