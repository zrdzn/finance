package dev.zrdzn.finance.backend.authentication

interface AuthenticationAttemptRepository {

    fun save(authenticationAttempt: AuthenticationAttempt): AuthenticationAttempt

    fun findById(id: Int): AuthenticationAttempt?

    fun doesIpAddressExistByUserId(userId: Int, ipAddress: String): Boolean

}
