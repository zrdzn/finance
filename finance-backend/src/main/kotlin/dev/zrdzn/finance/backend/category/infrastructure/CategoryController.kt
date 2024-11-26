package dev.zrdzn.finance.backend.category.infrastructure

import dev.zrdzn.finance.backend.category.CategoryService
import dev.zrdzn.finance.backend.category.api.CategoryCreateRequest
import dev.zrdzn.finance.backend.category.api.CategoryListResponse
import dev.zrdzn.finance.backend.category.api.CategoryResponse
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/categories")
class CategoryController(
    private val categoryService: CategoryService
) {

    @PostMapping("/create")
    fun createCategory(
        @AuthenticationPrincipal userId: Int,
        @RequestBody categoryCreateRequest: CategoryCreateRequest
    ): CategoryResponse =
        categoryService.createCategory(
            requesterId = userId,
            name = categoryCreateRequest.name,
            vaultId = categoryCreateRequest.vaultId,
        )

    @DeleteMapping("/{categoryId}")
    fun deleteCategory(
        @AuthenticationPrincipal userId: Int,
        @PathVariable categoryId: Int
    ): Unit = categoryService.deleteCategory(userId, categoryId)

    @GetMapping("/{categoryId}")
    fun getCategoryById(
        @AuthenticationPrincipal userId: Int,
        @PathVariable categoryId: Int
    ): CategoryResponse =
        categoryService.getCategoryById(userId, categoryId)

    @GetMapping("/vault/{vaultId}")
    fun getCategoriesByVaultId(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int
    ): CategoryListResponse =
        categoryService.getCategoriesByVaultId(userId, vaultId)

}