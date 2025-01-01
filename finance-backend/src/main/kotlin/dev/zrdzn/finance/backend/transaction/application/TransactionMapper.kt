package dev.zrdzn.finance.backend.transaction.application

import dev.zrdzn.finance.backend.product.application.response.ProductResponse
import dev.zrdzn.finance.backend.transaction.application.response.TransactionProductResponse
import dev.zrdzn.finance.backend.transaction.application.response.TransactionResponse
import dev.zrdzn.finance.backend.transaction.domain.Transaction
import dev.zrdzn.finance.backend.transaction.domain.TransactionProduct
import java.math.BigDecimal

object TransactionMapper {

    fun Transaction.toResponse(totalInVaultCurrency: BigDecimal) = TransactionResponse(
        id = this.id!!,
        userId = this.userId,
        vaultId = this.vaultId,
        createdAt = this.createdAt,
        transactionMethod = this.transactionMethod,
        transactionType = this.transactionType,
        description = this.description,
        totalInVaultCurrency = totalInVaultCurrency,
        total = this.total,
        currency = this.currency
    )

    fun TransactionProduct.toResponse(product: ProductResponse) = TransactionProductResponse(
        id = id!!,
        transactionId = transactionId,
        product = product,
        unitAmount = unitAmount,
        quantity = quantity
    )

}