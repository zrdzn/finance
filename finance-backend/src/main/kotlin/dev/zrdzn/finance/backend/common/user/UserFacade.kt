package dev.zrdzn.finance.backend.common.user

import dev.zrdzn.finance.backend.api.user.UserCreateRequest
import dev.zrdzn.finance.backend.api.user.UserCreateResponse
import org.springframework.security.crypto.password.PasswordEncoder

class UserFacade(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun createUser(userCreateRequest: UserCreateRequest): UserCreateResponse =
        userRepository
            .save(
                User(
                    id = null,
                    email = userCreateRequest.email,
                    username = userCreateRequest.username,
                    password = passwordEncoder.encode(userCreateRequest.password)
                )
            )
            .let { UserCreateResponse(it.id!!) }

}