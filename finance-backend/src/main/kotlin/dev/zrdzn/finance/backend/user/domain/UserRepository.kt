package dev.zrdzn.finance.backend.user.domain

interface UserRepository {

    fun save(user: User): User

    fun findById(id: Int): User?

    fun findByEmail(email: String): User?

    fun findIdByUsername(username: String): Int?

}