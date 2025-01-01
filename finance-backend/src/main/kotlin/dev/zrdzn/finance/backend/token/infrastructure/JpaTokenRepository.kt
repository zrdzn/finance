package dev.zrdzn.finance.backend.token.infrastructure

import dev.zrdzn.finance.backend.token.domain.Token
import dev.zrdzn.finance.backend.token.domain.TokenRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaTokenRepository : TokenRepository, Repository<Token, String>