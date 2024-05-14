package dev.zrdzn.finance.backend.common.category.infrastructure

import dev.zrdzn.finance.backend.api.category.CategoryCreateRequest
import dev.zrdzn.finance.backend.api.category.CategoryCreateResponse
import dev.zrdzn.finance.backend.api.category.CategoryListResponse
import dev.zrdzn.finance.backend.api.category.CategoryResponse
import dev.zrdzn.finance.backend.common.category.CategoryId
import dev.zrdzn.finance.backend.common.category.CategoryService
import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.vault.VaultId
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/categories")
class CategoryController(
    private val categoryService: CategoryService
) {

    @PostMapping("/create")
    fun createCategory(
        @AuthenticationPrincipal userId: UserId,
        @RequestBody categoryCreateRequest: CategoryCreateRequest
    ): CategoryCreateResponse =
        categoryService.createCategory(
            name = categoryCreateRequest.name,
            vaultId = categoryCreateRequest.vaultId
        )

    @DeleteMapping("/{categoryId}")
    fun deleteCategory(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable categoryId: CategoryId
    ): Unit = categoryService.deleteCategoryById(categoryId)

    @GetMapping("/{id}")
    fun getCategoryById(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable id: CategoryId
    ): ResponseEntity<CategoryResponse> =
        categoryService.getCategoryById(id)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @GetMapping("/vault/{vaultId}")
    fun getCategoriesByVaultId(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId
    ): CategoryListResponse =
        categoryService.getCategoriesByVaultId(vaultId)

}