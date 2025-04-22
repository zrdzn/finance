package dev.zrdzn.finance.backend.vault.error

import dev.zrdzn.finance.backend.error.FinanceApiError

class VaultCurrencyInvalidError : FinanceApiError(
    status = VaultErrorCode.CURRENCY_INVALID.status,
    code = VaultErrorCode.CURRENCY_INVALID.code,
    description = VaultErrorCode.CURRENCY_INVALID.description
)
