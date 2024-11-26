package dev.zrdzn.finance.backend.user.infrastructure

import dev.zrdzn.finance.backend.user.User
import dev.zrdzn.finance.backend.user.UserRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaUserRepository : UserRepository, Repository<User, Int> {

    @Query("SELECT user.id FROM User user WHERE user.username = :username")
    override fun findIdByUsername(username: String): Int?

}