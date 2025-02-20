package dev.zrdzn.finance.backend.vault.application.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class VaultNotFoundError : FinanceApiError(
    status = VaultErrorCode.NOT_FOUND.status,
    code = VaultErrorCode.NOT_FOUND.code,
    description = VaultErrorCode.NOT_FOUND.description
)

class VaultNotFoundByPublicIdError : FinanceApiError(
    status = VaultErrorCode.NOT_FOUND_BY_PUBLIC_ID.status,
    code = VaultErrorCode.NOT_FOUND_BY_PUBLIC_ID.code,
    description = VaultErrorCode.NOT_FOUND_BY_PUBLIC_ID.description
)
