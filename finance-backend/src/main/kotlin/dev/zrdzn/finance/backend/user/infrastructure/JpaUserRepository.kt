package dev.zrdzn.finance.backend.user.infrastructure

import dev.zrdzn.finance.backend.user.User
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.user.UserRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaUserRepository : UserRepository, Repository<User, UserId>