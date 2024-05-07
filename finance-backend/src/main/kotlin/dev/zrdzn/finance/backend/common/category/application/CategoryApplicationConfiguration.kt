package dev.zrdzn.finance.backend.common.category.application

import dev.zrdzn.finance.backend.common.category.CategoryRepository
import dev.zrdzn.finance.backend.common.category.CategoryService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class CategoryApplicationConfiguration(
    private val categoryRepository: CategoryRepository
) {

    @Bean
    fun categoryService(): CategoryService =
        CategoryService(
            categoryRepository = categoryRepository
        )

}