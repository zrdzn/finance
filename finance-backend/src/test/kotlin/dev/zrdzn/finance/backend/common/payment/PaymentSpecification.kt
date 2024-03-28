package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.common.user.UserSpecification
import org.springframework.beans.factory.annotation.Autowired

class PaymentSpecification : UserSpecification() {

    @Autowired
    protected lateinit var paymentFacade: PaymentFacade

}