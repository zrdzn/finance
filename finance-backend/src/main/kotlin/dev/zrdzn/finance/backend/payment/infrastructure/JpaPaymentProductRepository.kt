package dev.zrdzn.finance.backend.payment.infrastructure

import dev.zrdzn.finance.backend.payment.PaymentProduct
import dev.zrdzn.finance.backend.payment.PaymentProductId
import dev.zrdzn.finance.backend.payment.PaymentProductRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaPaymentProductRepository : PaymentProductRepository, Repository<PaymentProduct, PaymentProductId>