package dev.zrdzn.finance.backend.user.infrastructure

import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.user.api.UserEmailUpdateRequest
import dev.zrdzn.finance.backend.user.api.UserPasswordUpdateRequest
import dev.zrdzn.finance.backend.user.api.UserProfileUpdateRequest
import dev.zrdzn.finance.backend.user.api.UsernameResponse
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {

    @GetMapping("/update/request")
    fun requestUserUpdate(@AuthenticationPrincipal userId: UserId): Unit = userService.requestUserUpdate(userId)

    @PatchMapping("/update/email")
    fun updateUserEmail(
        @AuthenticationPrincipal userId: UserId,
        @RequestBody userEmailUpdateRequest: UserEmailUpdateRequest
    ): Unit = userService.updateUserEmail(userId, userEmailUpdateRequest.securityCode, userEmailUpdateRequest.email)

    @PatchMapping("/update/password")
    fun updateUserPassword(
        @AuthenticationPrincipal userId: UserId,
        @RequestBody userPasswordUpdateRequest: UserPasswordUpdateRequest
    ): Unit = userService.updateUserPassword(
        requesterId = userId,
        securityCode = userPasswordUpdateRequest.securityCode,
        oldPassword = userPasswordUpdateRequest.oldPassword,
        newPassword = userPasswordUpdateRequest.newPassword
    )

    @PatchMapping("/profile")
    fun updateUserProfile(
        @AuthenticationPrincipal userId: UserId,
        @RequestBody userProfileUpdateRequest: UserProfileUpdateRequest
    ): Unit = userService.updateUserProfile(userId, userProfileUpdateRequest.username)

    @GetMapping("/{userId}/username")
    fun getUsernameByUserId(@PathVariable userId: UserId): UsernameResponse = userService.getUsernameByUserId(userId)

}