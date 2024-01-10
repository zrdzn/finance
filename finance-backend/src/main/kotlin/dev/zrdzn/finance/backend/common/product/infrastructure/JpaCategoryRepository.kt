package dev.zrdzn.finance.backend.common.product.infrastructure

import dev.zrdzn.finance.backend.common.product.Category
import dev.zrdzn.finance.backend.common.product.CategoryId
import dev.zrdzn.finance.backend.common.product.CategoryRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaCategoryRepository : CategoryRepository, Repository<Category, CategoryId>