package dev.zrdzn.finance.backend.common.user

interface UserRepository {

    fun save(user: User): User

    fun findByEmail(email: String): User?

}