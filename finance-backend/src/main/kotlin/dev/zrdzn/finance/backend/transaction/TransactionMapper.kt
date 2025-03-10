package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.transaction.dto.TransactionProductListResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionProductResponse
import dev.zrdzn.finance.backend.transaction.dto.TransactionResponse
import dev.zrdzn.finance.backend.user.dto.UserResponse
import java.math.BigDecimal

object TransactionMapper {

    fun Transaction.toResponse(
        user: UserResponse,
        products: TransactionProductListResponse,
        totalInVaultCurrency: BigDecimal
    ) = TransactionResponse(
        id = this.id!!,
        user = user,
        vaultId = this.vaultId,
        createdAt = this.createdAt,
        transactionMethod = this.transactionMethod,
        transactionType = this.transactionType,
        products = products,
        description = this.description,
        totalInVaultCurrency = totalInVaultCurrency,
        total = this.total,
        currency = this.currency
    )

    fun TransactionProduct.toResponse(categoryName: String?) = TransactionProductResponse(
        id = id!!,
        transactionId = transactionId,
        name = name,
        categoryName = categoryName,
        unitAmount = unitAmount,
        quantity = quantity
    )

}