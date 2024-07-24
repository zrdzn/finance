package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.common.vault.api.VaultCreateResponse
import dev.zrdzn.finance.backend.common.authentication.AuthenticationSpecification
import dev.zrdzn.finance.backend.common.user.UserId

open class VaultSpecification : AuthenticationSpecification() {

    protected val vaultService: VaultService get() = application.getBean(VaultService::class.java)

    protected fun createVault(
        ownerId: UserId,
        name: String = "Default Vault"
    ): VaultCreateResponse =
        vaultService.createVault(
            ownerId = ownerId,
            name = name
        )

}