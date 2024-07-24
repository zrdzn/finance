package dev.zrdzn.finance.backend.category.infrastructure

import dev.zrdzn.finance.backend.category.Category
import dev.zrdzn.finance.backend.category.CategoryId
import dev.zrdzn.finance.backend.category.CategoryRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaCategoryRepository : CategoryRepository, Repository<Category, CategoryId>