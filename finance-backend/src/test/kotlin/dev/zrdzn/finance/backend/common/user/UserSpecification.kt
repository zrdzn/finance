package dev.zrdzn.finance.backend.common.user

import dev.zrdzn.finance.backend.common.ApplicationTestRunner
import dev.zrdzn.finance.backend.api.user.UserCreateRequest
import dev.zrdzn.finance.backend.api.user.UserCreateResponse
import dev.zrdzn.finance.backend.common.user.UserFacade
import org.springframework.beans.factory.annotation.Autowired

class UserSpecification : ApplicationTestRunner() {

    @Autowired
    protected lateinit var userFacade: UserFacade

    protected fun createUser(
        email: String = "test@goo.com",
        username: String = "test",
        password: String = "test"
    ): UserCreateResponse =
        userFacade.createUser(
            UserCreateRequest(
                email = email,
                username = username,
                password = password
            )
        )

}