package dev.zrdzn.finance.backend.common.category.infrastructure

import dev.zrdzn.finance.backend.common.category.Category
import dev.zrdzn.finance.backend.common.category.CategoryId
import dev.zrdzn.finance.backend.common.category.CategoryRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaCategoryRepository : CategoryRepository, Repository<Category, CategoryId>