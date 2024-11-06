package dev.zrdzn.finance.backend.vault.api

import dev.zrdzn.finance.backend.api.FinanceApiException

class VaultNotFoundException : FinanceApiException(
    status = VaultErrorCode.NOT_FOUND.status,
    code = VaultErrorCode.NOT_FOUND.code,
    description = VaultErrorCode.NOT_FOUND.description
)

class VaultNotFoundByPublicIdException : FinanceApiException(
    status = VaultErrorCode.NOT_FOUND_BY_PUBLIC_ID.status,
    code = VaultErrorCode.NOT_FOUND_BY_PUBLIC_ID.code,
    description = VaultErrorCode.NOT_FOUND_BY_PUBLIC_ID.description
)
