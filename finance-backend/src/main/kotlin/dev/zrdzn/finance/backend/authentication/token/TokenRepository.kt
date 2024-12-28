package dev.zrdzn.finance.backend.authentication.token

interface TokenRepository {

    fun save(token: Token): Token

    fun deleteById(tokenId: String)

    fun findById(tokenId: String): Token?

    fun findByUserId(userId: Int): Set<Token>

}