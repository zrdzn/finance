package dev.zrdzn.finance.backend.common.authentication.token

interface TokenRepository {

    fun save(token: Token): Token

    fun findById(tokenId: TokenId): Token?

}