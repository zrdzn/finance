package dev.zrdzn.finance.backend.transaction

import org.springframework.data.repository.Repository

interface TransactionProductRepository : Repository<TransactionProduct, Int> {

    fun save(transactionProduct: TransactionProduct): TransactionProduct

    fun findById(transactionProductId: Int): TransactionProduct?

    fun findByTransactionId(transactionId: Int): Set<TransactionProduct>

    fun deleteById(transactionProductId: Int)

}