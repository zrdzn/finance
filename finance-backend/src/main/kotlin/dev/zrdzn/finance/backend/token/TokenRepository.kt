package dev.zrdzn.finance.backend.token

import org.springframework.data.repository.Repository

interface TokenRepository : Repository<Token, String> {

    fun save(token: Token): Token

    fun deleteById(tokenId: String)

    fun findById(tokenId: String): Token?

    fun findByUserId(userId: Int): Set<Token>

}