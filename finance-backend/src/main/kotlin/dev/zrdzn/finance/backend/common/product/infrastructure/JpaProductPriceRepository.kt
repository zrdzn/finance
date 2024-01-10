package dev.zrdzn.finance.backend.common.product.infrastructure

import dev.zrdzn.finance.backend.common.product.ProductPrice
import dev.zrdzn.finance.backend.common.product.ProductPriceId
import dev.zrdzn.finance.backend.common.product.ProductPriceRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaProductPriceRepository : ProductPriceRepository, Repository<ProductPrice, ProductPriceId>