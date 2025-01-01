package dev.zrdzn.finance.backend.authentication.infrastructure

import dev.zrdzn.finance.backend.authentication.domain.AuthenticationAttempt
import dev.zrdzn.finance.backend.authentication.domain.AuthenticationAttemptRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaAuthenticationAttemptRepository : AuthenticationAttemptRepository, Repository<AuthenticationAttempt, Int> {

    @Query("""
        SELECT CASE WHEN COUNT(attempt) > 0 THEN TRUE ELSE FALSE END 
        FROM AuthenticationAttempt attempt 
        WHERE attempt.userId = :userId
        AND attempt.ipAddress = :ipAddress
        AND attempt.authenticatedAt IS NOT NULL
    """)
    override fun doesIpAddressExistByUserId(userId: Int, ipAddress: String): Boolean

}
