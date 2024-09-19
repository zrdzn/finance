package dev.zrdzn.finance.backend.category.application

import dev.zrdzn.finance.backend.audit.AuditService
import dev.zrdzn.finance.backend.category.CategoryRepository
import dev.zrdzn.finance.backend.category.CategoryService
import dev.zrdzn.finance.backend.vault.VaultService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class CategoryApplicationConfiguration(
    private val categoryRepository: CategoryRepository,
    private val vaultService: VaultService,
    private val auditService: AuditService
) {

    @Bean
    fun categoryService(): CategoryService =
        CategoryService(
            categoryRepository = categoryRepository,
            vaultService = vaultService,
            auditService = auditService
        )

}