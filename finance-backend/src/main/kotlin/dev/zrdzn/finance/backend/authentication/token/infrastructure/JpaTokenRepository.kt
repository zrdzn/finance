package dev.zrdzn.finance.backend.authentication.token.infrastructure

import dev.zrdzn.finance.backend.authentication.token.Token
import dev.zrdzn.finance.backend.authentication.token.TokenId
import dev.zrdzn.finance.backend.authentication.token.TokenRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaTokenRepository : TokenRepository, Repository<Token, TokenId>