package dev.zrdzn.finance.backend.category.infrastructure

import dev.zrdzn.finance.backend.category.domain.Category
import dev.zrdzn.finance.backend.category.domain.CategoryRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaCategoryRepository : CategoryRepository, Repository<Category, Int>