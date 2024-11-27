package dev.zrdzn.finance.backend.product.infrastructure

import dev.zrdzn.finance.backend.product.Product
import dev.zrdzn.finance.backend.product.ProductRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaProductRepository : ProductRepository, Repository<Product, Int>