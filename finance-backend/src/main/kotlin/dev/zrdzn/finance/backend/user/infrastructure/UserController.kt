package dev.zrdzn.finance.backend.user.infrastructure

import dev.zrdzn.finance.backend.shared.getBaseUrl
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.user.api.*
import dev.zrdzn.finance.backend.user.api.security.TwoFactorSetupRequest
import dev.zrdzn.finance.backend.user.api.security.TwoFactorSetupResponse
import dev.zrdzn.finance.backend.user.api.security.TwoFactorVerifyRequest
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.InputStreamResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
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

    @PostMapping("/2fa/setup")
    fun requestUserTwoFactorSetup(
        @AuthenticationPrincipal userId: UserId,
        @RequestBody twoFactorSetupRequest: TwoFactorSetupRequest
    ): TwoFactorSetupResponse = userService.requestUserTwoFactorSetup(userId, twoFactorSetupRequest.securityCode)

    @PostMapping("/2fa/setup/verify")
    fun verifyUserTwoFactorSetup(
        @AuthenticationPrincipal userId: UserId,
        @RequestBody twoFactorVerifyRequest: TwoFactorVerifyRequest
    ): Unit = userService.verifyUserTwoFactorSetup(userId, twoFactorVerifyRequest.secret, twoFactorVerifyRequest.oneTimePassword)

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

    @PutMapping("/avatar", consumes = [MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE])
    fun updateUserAvatar(
        @AuthenticationPrincipal userId: Int,
        @RequestPart("avatar") avatar: MultipartFile
    ) {
        userService.updateUserAvatarById(userId, avatar.bytes)
    }

    @GetMapping("/{userId}/username")
    fun getUsernameByUserId(@PathVariable userId: UserId): UsernameResponse = userService.getUsernameByUserId(userId)

    @GetMapping("/avatar/{username}")
    fun getUserAvatar(@PathVariable username: String): ResponseEntity<Resource> =
        userService.getUserAvatarByUsername(username)
            .let { ok().body(InputStreamResource(it)) }

}
