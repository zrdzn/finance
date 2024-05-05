package dev.zrdzn.finance.backend.common.user.infrastructure

import dev.zrdzn.finance.backend.api.user.UsernameResponse
import dev.zrdzn.finance.backend.common.user.UserId
import dev.zrdzn.finance.backend.common.user.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {

    @GetMapping("/{userId}/username")
    fun getUsernameByUserId(@PathVariable userId: UserId): ResponseEntity<UsernameResponse> =
        userService.getUsernameByUserId(userId)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

}