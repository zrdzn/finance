package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.authentication.AuthenticationSpecification
import dev.zrdzn.finance.backend.transaction.api.TransactionMethod
import dev.zrdzn.finance.backend.vault.api.VaultResponse

open class VaultSpecification : AuthenticationSpecification() {

    protected val vaultService: VaultService get() = application.getBean(VaultService::class.java)

    protected fun createVault(
        ownerId: Int,
        name: String,
        currency: String,
        defaultTransactionMethod: TransactionMethod
    ): VaultResponse =
        vaultService.createVault(
            ownerId = ownerId,
            name = name,
            currency = currency,
            defaultTransactionMethod = defaultTransactionMethod
        )

}