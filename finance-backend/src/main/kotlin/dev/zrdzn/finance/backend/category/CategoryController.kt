package dev.zrdzn.finance.backend.category

import dev.zrdzn.finance.backend.category.dto.CategoryCreateRequest
import dev.zrdzn.finance.backend.category.dto.CategoryListResponse
import dev.zrdzn.finance.backend.category.dto.CategoryResponse
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v1/categories")
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