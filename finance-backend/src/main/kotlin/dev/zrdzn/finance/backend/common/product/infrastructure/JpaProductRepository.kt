package dev.zrdzn.finance.backend.common.product.infrastructure

import dev.zrdzn.finance.backend.common.product.Product
import dev.zrdzn.finance.backend.common.product.ProductId
import dev.zrdzn.finance.backend.common.product.ProductRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaProductRepository : ProductRepository, Repository<Product, ProductId>