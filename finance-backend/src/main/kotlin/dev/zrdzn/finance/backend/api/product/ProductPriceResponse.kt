package dev.zrdzn.finance.backend.api.product

import dev.zrdzn.finance.backend.api.price.Price
import dev.zrdzn.finance.backend.common.product.ProductId
import dev.zrdzn.finance.backend.common.product.ProductPriceId

data class ProductPriceResponse(
    val id: ProductPriceId,
    val productId: ProductId,
    val price: Price,
)
