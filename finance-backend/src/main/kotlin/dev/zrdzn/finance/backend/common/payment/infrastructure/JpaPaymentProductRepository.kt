package dev.zrdzn.finance.backend.common.payment.infrastructure

import dev.zrdzn.finance.backend.common.payment.Payment
import dev.zrdzn.finance.backend.common.payment.PaymentId
import dev.zrdzn.finance.backend.common.payment.PaymentProduct
import dev.zrdzn.finance.backend.common.payment.PaymentProductId
import dev.zrdzn.finance.backend.common.payment.PaymentProductRepository
import dev.zrdzn.finance.backend.common.payment.PaymentRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaPaymentProductRepository : PaymentProductRepository, Repository<PaymentProductId, PaymentProduct>