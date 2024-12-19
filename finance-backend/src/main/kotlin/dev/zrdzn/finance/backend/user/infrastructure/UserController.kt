package dev.zrdzn.finance.backend.user.infrastructure

import dev.zrdzn.finance.backend.shared.getBaseUrl
import dev.zrdzn.finance.backend.user.UserService
import dev.zrdzn.finance.backend.user.api.UserEmailUpdateRequest
import dev.zrdzn.finance.backend.user.api.UserPasswordUpdateRequest
import dev.zrdzn.finance.backend.user.api.UserProfileUpdateRequest
import dev.zrdzn.finance.backend.user.api.UsernameResponse
import dev.zrdzn.finance.backend.user.api.security.TwoFactorSetupRequest
import dev.zrdzn.finance.backend.user.api.security.TwoFactorSetupResponse
import dev.zrdzn.finance.backend.user.api.security.TwoFactorVerifyRequest
import jakarta.servlet.http.HttpServletRequest
import java.net.URI
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.InputStreamResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService,
    @Value("\${client.url}") private val clientUrl: String
) {

    @GetMapping("/update/request")
    fun requestUserUpdate(@AuthenticationPrincipal userId: Int): Unit = userService.requestUserUpdate(userId)

    @GetMapping("/verify/request")
    fun requestUserVerification(@AuthenticationPrincipal userId: Int, request: HttpServletRequest): Unit =
        userService.requestUserVerification(userId, "${request.getBaseUrl()}/api/users/verify")

    @PostMapping("/2fa/setup")
    fun requestUserTwoFactorSetup(
        @AuthenticationPrincipal userId: Int,
        @RequestBody twoFactorSetupRequest: TwoFactorSetupRequest
    ): TwoFactorSetupResponse = userService.requestUserTwoFactorSetup(userId, twoFactorSetupRequest.securityCode)

    @PostMapping("/2fa/setup/verify")
    fun verifyUserTwoFactorSetup(
        @AuthenticationPrincipal userId: Int,
        @RequestBody twoFactorVerifyRequest: TwoFactorVerifyRequest
    ): Unit = userService.verifyUserTwoFactorSetup(userId, twoFactorVerifyRequest.secret, twoFactorVerifyRequest.oneTimePassword)

    @PatchMapping("/update/email")
    fun updateUserEmail(
        @AuthenticationPrincipal userId: Int,
        @RequestBody userEmailUpdateRequest: UserEmailUpdateRequest
    ): Unit = userService.updateUserEmail(userId, userEmailUpdateRequest.securityCode, userEmailUpdateRequest.email)

    @PatchMapping("/update/password")
    fun updateUserPassword(
        @AuthenticationPrincipal userId: Int,
        @RequestBody userPasswordUpdateRequest: UserPasswordUpdateRequest
    ): Unit = userService.updateUserPassword(
        requesterId = userId,
        securityCode = userPasswordUpdateRequest.securityCode,
        oldPassword = userPasswordUpdateRequest.oldPassword,
        newPassword = userPasswordUpdateRequest.newPassword
    )

    @PatchMapping("/profile")
    fun updateUserProfile(
        @AuthenticationPrincipal userId: Int,
        @RequestBody userProfileUpdateRequest: UserProfileUpdateRequest
    ): Unit = userService.updateUserProfile(
        requesterId = userId,
        username = userProfileUpdateRequest.username,
        decimalSeparator = userProfileUpdateRequest.decimalSeparator,
        groupSeparator = userProfileUpdateRequest.groupSeparator
    )

    @GetMapping("/verify")
    fun verifyUser(
        @AuthenticationPrincipal userId: Int,
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
    ): Unit = userService.updateUserAvatar(userId, avatar.bytes)

    @GetMapping("/{userId}/username")
    fun getUsernameByUserId(@PathVariable userId: Int): UsernameResponse = userService.getUsername(userId)

    @GetMapping("/avatar/{username}")
    fun getUserAvatar(@PathVariable username: String): ResponseEntity<Resource> =
        userService.getUserAvatar(username)
            .let { ok().body(InputStreamResource(it)) }

}
