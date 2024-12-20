package dev.zrdzn.finance.backend.user

import dev.zrdzn.finance.backend.ApplicationTestRunner
import dev.zrdzn.finance.backend.user.api.UserCreateRequest
import dev.zrdzn.finance.backend.user.api.UserResponse

open class UserSpecification : ApplicationTestRunner() {

    protected val userService: UserService get() = application.getBean(UserService::class.java)

    protected fun createUserCreateRequest(
        email: String,
        username: String,
        password: String
    ): UserCreateRequest =
        UserCreateRequest(
            email = email,
            username = username,
            password = password
        )

    protected fun createUser(
        email: String,
        username: String,
        password: String
    ): UserResponse =
        userService.createUser(
            createUserCreateRequest(
                email = email,
                username = username,
                password = password
            )
        )

}