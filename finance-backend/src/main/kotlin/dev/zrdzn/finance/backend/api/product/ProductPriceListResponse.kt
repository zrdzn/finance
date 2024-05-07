package dev.zrdzn.finance.backend.api.product

data class ProductPriceListResponse(
    val productPrices: Set<ProductPriceResponse>
)
