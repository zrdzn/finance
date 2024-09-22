package dev.zrdzn.finance.backend.transaction.infrastructure

import dev.zrdzn.finance.backend.transaction.TransactionProduct
import dev.zrdzn.finance.backend.transaction.TransactionProductId
import dev.zrdzn.finance.backend.transaction.TransactionProductRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaTransactionProductRepository : TransactionProductRepository, Repository<TransactionProduct, TransactionProductId>