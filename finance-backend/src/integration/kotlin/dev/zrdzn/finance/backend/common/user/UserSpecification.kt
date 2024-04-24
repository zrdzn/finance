package dev.zrdzn.finance.backend.common.user

import dev.zrdzn.finance.backend.common.ApplicationTestRunner
import dev.zrdzn.finance.backend.api.user.UserCreateRequest
import dev.zrdzn.finance.backend.api.user.UserCreateResponse

open class UserSpecification : ApplicationTestRunner() {

    protected val userService: UserService get() = application.getBean(UserService::class.java)

    protected fun createUserCreateRequest(
        email: String = "test@goo.com",
        username: String = "test",
        password: String = "test"
    ): UserCreateRequest =
        UserCreateRequest(
            email = email,
            username = username,
            password = password
        )

    protected fun createUser(
        email: String = "test@goo.com",
        username: String = "test",
        password: String = "test"
    ): UserCreateResponse =
        userService.createUser(
            createUserCreateRequest(
                email = email,
                username = username,
                password = password
            )
        )

}