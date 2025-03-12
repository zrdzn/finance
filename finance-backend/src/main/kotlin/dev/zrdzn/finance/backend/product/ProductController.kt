package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.product.dto.ProductCreateRequest
import dev.zrdzn.finance.backend.product.dto.ProductListResponse
import dev.zrdzn.finance.backend.product.dto.ProductResponse
import dev.zrdzn.finance.backend.product.dto.ProductUpdateRequest
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

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
                categoryId = productCreateRequest.categoryId,
                unitAmount = productCreateRequest.unitAmount
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
                categoryId = productUpdateRequest.categoryId,
                unitAmount = productUpdateRequest.unitAmount
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