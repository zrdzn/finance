package dev.zrdzn.finance.backend.authentication

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository

interface AuthenticationAttemptRepository : Repository<AuthenticationAttempt, Int> {

    fun save(authenticationAttempt: AuthenticationAttempt): AuthenticationAttempt

    fun findById(id: Int): AuthenticationAttempt?

    @Query("""
        SELECT CASE WHEN COUNT(attempt) > 0 THEN TRUE ELSE FALSE END 
        FROM AuthenticationAttempt attempt 
        WHERE attempt.userId = :userId
        AND attempt.ipAddress = :ipAddress
        AND attempt.authenticatedAt IS NOT NULL
    """)
    fun doesIpAddressExistByUserId(userId: Int, ipAddress: String): Boolean

}
