package dev.zrdzn.finance.backend.user

interface UserRepository {

    fun save(user: User): User

    fun findById(id: UserId): User?

    fun findByEmail(email: String): User?

}