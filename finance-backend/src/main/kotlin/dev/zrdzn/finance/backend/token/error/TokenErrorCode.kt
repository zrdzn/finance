package dev.zrdzn.finance.backend.token.error

import org.springframework.http.HttpStatus

enum class TokenErrorCode(val status: Int, val code: String, val description: String) {
    SIGNATURE_MISMATCH(HttpStatus.UNAUTHORIZED.value(), "TOKEN_SIGNATURE_MISMATCH", "There is a signature mismatch for provided access token")
}
