package dev.zrdzn.finance.backend.common.payment.infrastructure

import dev.zrdzn.finance.backend.common.payment.PaymentPrice
import dev.zrdzn.finance.backend.common.payment.PaymentPriceId
import dev.zrdzn.finance.backend.common.payment.PaymentPriceRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaPaymentPriceRepository : PaymentPriceRepository, Repository<PaymentPrice, PaymentPriceId>