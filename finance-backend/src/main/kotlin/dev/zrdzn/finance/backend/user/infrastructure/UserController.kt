package dev.zrdzn.finance.backend.user.infrastructure

import dev.zrdzn.finance.backend.shared.getBaseUrl
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.user.api.*
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.net.URI

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService,
    @Value("\${client.url}") private val clientUrl: String
) {

    @GetMapping("/update/request")
    fun requestUserUpdate(@AuthenticationPrincipal userId: UserId): Unit = userService.requestUserUpdate(userId)

    @GetMapping("/verify/request")
    fun requestUserVerification(@AuthenticationPrincipal userId: UserId, request: HttpServletRequest): Unit =
        userService.requestUserVerification(userId, "${request.getBaseUrl()}/api/users/verify")

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

    @GetMapping("/verify")
    fun verifyUser(
        @AuthenticationPrincipal userId: UserId,
        @RequestParam("securityCode") securityCode: String
    ): ResponseEntity<Unit> {
        userService.verifyUser(userId, securityCode)

        return ResponseEntity.status(HttpStatus.FOUND)
            .location(URI.create("$clientUrl/account/settings"))
            .build()
    }

    @GetMapping("/{userId}/username")
    fun getUsernameByUserId(@PathVariable userId: UserId): UsernameResponse = userService.getUsernameByUserId(userId)

}