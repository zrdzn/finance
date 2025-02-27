package dev.zrdzn.finance.backend.user.application

import dev.samstevens.totp.code.CodeVerifier
import dev.zrdzn.finance.backend.shared.storage.StorageClient
import dev.zrdzn.finance.backend.user.application.UserMapper.toResponse
import dev.zrdzn.finance.backend.user.application.error.TwoFactorAlreadyEnabledError
import dev.zrdzn.finance.backend.user.application.error.UserAccessDeniedError
import dev.zrdzn.finance.backend.user.application.error.UserEmailAlreadyTakenError
import dev.zrdzn.finance.backend.user.application.request.UserCreateRequest
import dev.zrdzn.finance.backend.user.application.response.TwoFactorSetupResponse
import dev.zrdzn.finance.backend.user.application.response.UserResponse
import dev.zrdzn.finance.backend.user.application.response.UserWithPasswordResponse
import dev.zrdzn.finance.backend.user.application.response.UsernameResponse
import dev.zrdzn.finance.backend.user.domain.User
import dev.zrdzn.finance.backend.user.domain.UserRepository
import java.io.InputStream
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val userProtectionService: UserProtectionService,
    private val twoFactorCodeGenerator: TwoFactorCodeGenerator,
    private val codeVerifier: CodeVerifier,
    private val storageClient: StorageClient
) {

    private val avatarsBucket = "avatars"

    @Transactional
    fun createUser(userCreateRequest: UserCreateRequest): UserResponse {
        if (doesUserExist(userCreateRequest.email)) {
            throw UserEmailAlreadyTakenError()
        }

        return userRepository
            .save(
                User(
                    id = null,
                    email = userCreateRequest.email,
                    username = userCreateRequest.username,
                    password = passwordEncoder.encode(userCreateRequest.password),
                    verified = false,
                    totpSecret = null,
                    decimalSeparator = ".",
                    groupSeparator = ","
                )
            )
            .toResponse()
    }

    @Transactional
    fun requestUserUpdate(requesterId: Int) {
        val user = userRepository.findById(requesterId) ?: throw UserAccessDeniedError()

        userProtectionService.sendUserUpdateCode(user.id!!, user.email)
    }

    @Transactional
    fun requestUserVerification(requesterId: Int, verificationLink: String) {
        val user = userRepository.findById(requesterId) ?: throw UserAccessDeniedError()

        userProtectionService.sendUserVerificationLink(user.id!!, user.email, verificationLink)
    }

    @Transactional
    fun requestUserTwoFactorSetup(requesterId: Int, securityCode: String): TwoFactorSetupResponse {
        val user = userRepository.findById(requesterId) ?: throw UserAccessDeniedError()

        if (!userProtectionService.isAccessGranted(userId = user.id!!, securityCode = securityCode)) {
            throw UserAccessDeniedError()
        }

        if (user.totpSecret != null) {
            throw TwoFactorAlreadyEnabledError()
        }

        return twoFactorCodeGenerator.generateTwoFactorSecret(user.email)
    }

    @Transactional
    fun verifyUserTwoFactorSetup(requesterId: Int, secret: String, oneTimePassword: String) {
        val user = userRepository.findById(requesterId) ?: throw UserAccessDeniedError()

        if (!codeVerifier.isValidCode(secret, oneTimePassword)) {
            throw UserAccessDeniedError()
        }

        user.totpSecret = secret
    }

    @Transactional(readOnly = true)
    fun verifyUserTwoFactorCode(secret: String, oneTimePassword: String): Boolean {
        return codeVerifier.isValidCode(secret, oneTimePassword)
    }

    @Transactional
    fun updateUserEmail(requesterId: Int, securityCode: String, email: String) {
        val user = userRepository.findById(requesterId) ?: throw UserAccessDeniedError()

        if (!userProtectionService.isAccessGranted(userId = user.id!!, securityCode = securityCode)) {
            throw UserAccessDeniedError()
        }

        user.email = email
    }

    @Transactional
    fun updateUserPassword(requesterId: Int, securityCode: String, oldPassword: String, newPassword: String) {
        val user = userRepository.findById(requesterId) ?: throw UserAccessDeniedError()

        if (!userProtectionService.isAccessGranted(userId = user.id!!, securityCode = securityCode)) {
            throw UserAccessDeniedError()
        }

        if (!passwordEncoder.matches(oldPassword, user.password)) {
            throw UserAccessDeniedError()
        }

        user.password = passwordEncoder.encode(newPassword)
    }

    @Transactional
    fun updateUserProfile(requesterId: Int, username: String, decimalSeparator: String, groupSeparator: String) {
        val user = userRepository.findById(requesterId) ?: throw UserAccessDeniedError()

        user.username = username
        user.decimalSeparator = decimalSeparator
        user.groupSeparator = groupSeparator
    }

    @Transactional
    fun verifyUser(requesterId: Int, securityCode: String) {
        val user = userRepository.findById(requesterId) ?: throw UserAccessDeniedError()

        if (!userProtectionService.isAccessGranted(userId = user.id!!, securityCode = securityCode)) {
            throw UserAccessDeniedError()
        }

        user.verified = true
    }

    @Transactional
    fun updateUserAvatar(requesterId: Int, avatar: ByteArray) {
        userRepository.findById(requesterId) ?: throw UserAccessDeniedError()

        storageClient.saveFile(avatarsBucket, requesterId.toString(), data = avatar.inputStream())
    }

    @Transactional(readOnly = true)
    fun doesUserExist(email: String): Boolean =
        userRepository.findByEmail(email) != null

    @Transactional(readOnly = true)
    fun getUser(userId: Int): UserResponse =
        userRepository.findById(userId)
            ?.let {
                UserResponse(
                    id = it.id!!,
                    email = it.email,
                    username = it.username,
                    verified = it.verified,
                    isTwoFactorEnabled = it.totpSecret != null,
                    decimalSeparator = it.decimalSeparator,
                    groupSeparator = it.groupSeparator
                )
            }
            ?: throw UserAccessDeniedError()

    @Transactional(readOnly = true)
    fun getUserId(username: String): Int =
        userRepository.findIdByUsername(username) ?: throw UserAccessDeniedError()

    @Transactional(readOnly = true)
    fun getUsername(userId: Int): UsernameResponse =
        UsernameResponse(getUser(userId).username)

    @Transactional(readOnly = true)
    fun getInsecureUser(email: String): UserWithPasswordResponse? =
        userRepository
            .findByEmail(email)
            ?.let {
                UserWithPasswordResponse(
                    id = it.id!!,
                    email = it.email,
                    username = it.username,
                    password = it.password,
                    verified = it.verified,
                    totpSecret = it.totpSecret
                )
            }

    @Transactional(readOnly = true)
    fun getUserAvatar(username: String): InputStream =
        getUserId(username)
            .let { storageClient.loadFile(avatarsBucket, it.toString()) }
            ?: throw UserAccessDeniedError()

}
