package dev.zrdzn.finance.backend.common.user

import dev.zrdzn.finance.backend.api.user.UserCreateRequest
import dev.zrdzn.finance.backend.api.user.UserCreateResponse
import dev.zrdzn.finance.backend.api.user.UserWithPasswordResponse
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

    fun getUserWithPasswordByEmail(email: String): UserWithPasswordResponse? =
        userRepository
            .findByEmail(email)
            ?.let {
                UserWithPasswordResponse(
                    id = it.id!!,
                    email = it.email,
                    username = it.username,
                    password = it.password
                )
            }

}