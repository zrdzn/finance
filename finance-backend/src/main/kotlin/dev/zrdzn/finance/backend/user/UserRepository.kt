package dev.zrdzn.finance.backend.user

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.Param

interface UserRepository : Repository<User, Int> {

    fun save(user: User): User

    fun findById(id: Int): User?

    fun findByEmail(email: String): User?

    @Query("SELECT user.id FROM User user WHERE user.username = :username")
    fun findIdByUsername(@Param("username") username: String): Int?

}