package dev.zrdzn.finance.backend.category.application

import dev.zrdzn.finance.backend.category.CategoryRepository
import dev.zrdzn.finance.backend.category.CategoryService
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