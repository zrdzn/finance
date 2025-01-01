package dev.zrdzn.finance.backend.authentication.domain

interface AuthenticationAttemptRepository {

    fun save(authenticationAttempt: AuthenticationAttempt): AuthenticationAttempt

    fun findById(id: Int): AuthenticationAttempt?

    fun doesIpAddressExistByUserId(userId: Int, ipAddress: String): Boolean

}
