package dev.zrdzn.finance.backend.authentication.token.api

import org.springframework.http.HttpStatus

enum class TokenErrorCode(val status: Int, val code: String, val description: String) {
    SIGNATURE_MISMATCH(HttpStatus.UNAUTHORIZED.value(), "TOKEN_SIGNATURE_MISMATCH", "There is a signature mismatch for provided access token")
}
