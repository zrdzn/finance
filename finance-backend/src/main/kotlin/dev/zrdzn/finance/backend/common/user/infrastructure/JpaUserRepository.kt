package dev.zrdzn.finance.backend.common.user.infrastructure

import dev.zrdzn.finance.backend.common.user.User
import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.user.UserRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaUserRepository : UserRepository, Repository<UserId, User>