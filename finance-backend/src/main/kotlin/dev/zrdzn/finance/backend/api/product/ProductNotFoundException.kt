package dev.zrdzn.finance.backend.api.product

import dev.zrdzn.finance.backend.common.product.ProductId

data class ProductNotFoundException(
    val productId: ProductId,
    override val cause: Throwable? = null
) : RuntimeException("Product with id $productId not found", cause)