package dev.zrdzn.finance.backend.api.authentication

typealias SessionId = String

data class AuthenticationResponse(
    val sessionId: SessionId
)
