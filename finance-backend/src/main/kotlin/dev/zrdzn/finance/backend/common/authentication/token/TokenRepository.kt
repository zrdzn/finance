package dev.zrdzn.finance.backend.common.authentication.token

interface TokenRepository {

    fun save(token: Token): Token

    fun deleteById(tokenId: TokenId)

    fun findById(tokenId: TokenId): Token?

}