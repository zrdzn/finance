package dev.zrdzn.finance.backend.user

import dev.zrdzn.finance.backend.ApplicationTestRunner
import dev.zrdzn.finance.backend.common.user.api.UserCreateRequest
import dev.zrdzn.finance.backend.common.user.api.UserCreateResponse

open class UserSpecification : dev.zrdzn.finance.backend.ApplicationTestRunner() {

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