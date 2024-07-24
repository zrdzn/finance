package dev.zrdzn.finance.backend.product.api

import dev.zrdzn.finance.backend.product.ProductId

data class ProductNotFoundException(
    val productId: ProductId,
    override val cause: Throwable? = null
) : RuntimeException("Product with id $productId not found", cause)
