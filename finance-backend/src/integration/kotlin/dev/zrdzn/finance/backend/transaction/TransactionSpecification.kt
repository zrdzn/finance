package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.vault.VaultSpecification

open class TransactionSpecification : VaultSpecification() {

    protected val transactionService: TransactionService get() = application.getBean(TransactionService::class.java)

}