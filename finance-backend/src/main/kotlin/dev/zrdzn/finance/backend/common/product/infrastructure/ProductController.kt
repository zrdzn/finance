package dev.zrdzn.finance.backend.common.product.infrastructure

import dev.zrdzn.finance.backend.api.product.ProductCreateRequest
import dev.zrdzn.finance.backend.api.product.ProductCreateResponse
import dev.zrdzn.finance.backend.api.product.ProductListResponse
import dev.zrdzn.finance.backend.api.product.ProductUpdateRequest
import dev.zrdzn.finance.backend.common.product.ProductId
import dev.zrdzn.finance.backend.common.product.ProductService
import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.vault.VaultId
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
        @AuthenticationPrincipal userId: UserId,
        @RequestBody productCreateRequest: ProductCreateRequest
    ): ProductCreateResponse =
        productService
            .createProduct(
                name = productCreateRequest.name,
                vaultId = productCreateRequest.vaultId,
                categoryId = productCreateRequest.categoryId
            )

    @PatchMapping("/{productId}")
    fun updateProduct(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable productId: ProductId,
        @RequestBody productUpdateRequest: ProductUpdateRequest
    ): Unit =
        productService
            .updateProduct(
                productId = productId,
                categoryId = productUpdateRequest.categoryId
            )

    @DeleteMapping("/{productId}")
    fun deleteProduct(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable productId: ProductId
    ): Unit = productService.deleteProductById(productId)

    @GetMapping("/{vaultId}")
    fun getPaymentsByVaultId(
        @AuthenticationPrincipal userId: UserId,
        @PathVariable vaultId: VaultId
    ): ProductListResponse =
        productService.getProductsByVaultId(vaultId)

}