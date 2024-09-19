package dev.zrdzn.finance.backend.user

import dev.zrdzn.finance.backend.user.api.UserCreateRequest
import dev.zrdzn.finance.backend.user.api.UserCreateResponse
import dev.zrdzn.finance.backend.user.api.UserResponse
import dev.zrdzn.finance.backend.user.api.UserWithPasswordResponse
import dev.zrdzn.finance.backend.user.api.UsernameResponse
import org.springframework.security.crypto.password.PasswordEncoder

class UserService(
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

    fun getUserById(id: UserId): UserResponse? =
        userRepository.findById(id)
            ?.let {
                UserResponse(
                    id = it.id!!,
                    email = it.email,
                    username = it.username
                )
            }

    fun getUsernameByUserId(id: UserId): UsernameResponse? =
        getUserById(id)?.let { UsernameResponse(it.username) }

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