package dev.zrdzn.finance.backend.authentication.token

interface TokenRepository {

    fun save(token: Token): Token

    fun deleteById(tokenId: TokenId)

    fun findById(tokenId: TokenId): Token?

}