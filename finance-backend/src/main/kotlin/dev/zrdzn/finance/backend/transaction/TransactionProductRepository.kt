package dev.zrdzn.finance.backend.transaction

interface TransactionProductRepository {

    fun save(transactionProduct: TransactionProduct): TransactionProduct

    fun findByTransactionId(transactionId: Int): Set<TransactionProduct>

}