package dev.zrdzn.finance.backend.common.authentication.token.infrastructure

import dev.zrdzn.finance.backend.common.authentication.token.Token
import dev.zrdzn.finance.backend.common.authentication.token.TokenId
import dev.zrdzn.finance.backend.common.authentication.token.TokenRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaTokenRepository : TokenRepository, Repository<Token, TokenId>