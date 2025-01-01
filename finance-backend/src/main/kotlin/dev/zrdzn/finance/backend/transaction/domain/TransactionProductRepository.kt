package dev.zrdzn.finance.backend.transaction.domain

interface TransactionProductRepository {

    fun save(transactionProduct: TransactionProduct): TransactionProduct

    fun findById(transactionProductId: Int): TransactionProduct?

    fun findByTransactionId(transactionId: Int): Set<TransactionProduct>

}