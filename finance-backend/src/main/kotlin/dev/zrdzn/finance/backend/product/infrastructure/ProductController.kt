package dev.zrdzn.finance.backend.product.infrastructure

import dev.zrdzn.finance.backend.product.ProductService
import dev.zrdzn.finance.backend.product.api.ProductCreateRequest
import dev.zrdzn.finance.backend.product.api.ProductListResponse
import dev.zrdzn.finance.backend.product.api.ProductResponse
import dev.zrdzn.finance.backend.product.api.ProductUpdateRequest
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/products")
class ProductController(
    private val productService: ProductService
) {

    @PostMapping("/create")
    fun createProduct(
        @AuthenticationPrincipal userId: Int,
        @RequestBody productCreateRequest: ProductCreateRequest
    ): ProductResponse =
        productService
            .createProduct(
                requesterId = userId,
                name = productCreateRequest.name,
                vaultId = productCreateRequest.vaultId,
                categoryId = productCreateRequest.categoryId
            )

    @PatchMapping("/{productId}")
    fun updateProduct(
        @AuthenticationPrincipal userId: Int,
        @PathVariable productId: Int,
        @RequestBody productUpdateRequest: ProductUpdateRequest
    ): Unit =
        productService
            .updateProduct(
                requesterId = userId,
                productId = productId,
                categoryId = productUpdateRequest.categoryId
            )

    @DeleteMapping("/{productId}")
    fun deleteProduct(
        @AuthenticationPrincipal userId: Int,
        @PathVariable productId: Int
    ): Unit = productService.deleteProduct(userId, productId)

    @GetMapping("/{vaultId}")
    fun getProductsByVaultId(
        @AuthenticationPrincipal userId: Int,
        @PathVariable vaultId: Int
    ): ProductListResponse = productService.getProducts(userId, vaultId)

}