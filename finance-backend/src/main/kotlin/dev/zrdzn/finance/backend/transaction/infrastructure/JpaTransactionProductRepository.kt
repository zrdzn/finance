package dev.zrdzn.finance.backend.transaction.infrastructure

import dev.zrdzn.finance.backend.transaction.domain.TransactionProduct
import dev.zrdzn.finance.backend.transaction.domain.TransactionProductRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaTransactionProductRepository : TransactionProductRepository, Repository<TransactionProduct, Int>