package dev.zrdzn.finance.backend.transaction.application

import dev.zrdzn.finance.backend.product.application.response.ProductResponse
import dev.zrdzn.finance.backend.transaction.application.response.TransactionProductListResponse
import dev.zrdzn.finance.backend.transaction.application.response.TransactionProductResponse
import dev.zrdzn.finance.backend.transaction.application.response.TransactionResponse
import dev.zrdzn.finance.backend.transaction.domain.Transaction
import dev.zrdzn.finance.backend.transaction.domain.TransactionProduct
import dev.zrdzn.finance.backend.user.application.response.UserResponse
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

    fun TransactionProduct.toResponse(product: ProductResponse) = TransactionProductResponse(
        id = id!!,
        transactionId = transactionId,
        product = product,
        unitAmount = unitAmount,
        quantity = quantity
    )

}