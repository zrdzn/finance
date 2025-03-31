package dev.zrdzn.finance.backend.user

import dev.samstevens.totp.code.CodeVerifier
import dev.zrdzn.finance.backend.authentication.AuthenticationProvider
import dev.zrdzn.finance.backend.storage.StorageClient
import dev.zrdzn.finance.backend.user.UserMapper.toResponse
import dev.zrdzn.finance.backend.user.dto.TwoFactorSetupResponse
import dev.zrdzn.finance.backend.user.dto.UserResponse
import dev.zrdzn.finance.backend.user.dto.UserWithPasswordResponse
import dev.zrdzn.finance.backend.user.dto.UsernameResponse
import dev.zrdzn.finance.backend.user.error.TwoFactorAlreadyEnabledError
import dev.zrdzn.finance.backend.user.error.UserAccessDeniedError
import dev.zrdzn.finance.backend.user.error.UserDecimalSeparatorInvalidError
import dev.zrdzn.finance.backend.user.error.UserEmailAlreadyTakenError
import dev.zrdzn.finance.backend.user.error.UserEmailInvalidError
import dev.zrdzn.finance.backend.user.error.UserGroupSeparatorInvalidError
import dev.zrdzn.finance.backend.user.error.UserPasswordInvalidError
import dev.zrdzn.finance.backend.user.error.UserUsernameInvalidError
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

    companion object {
        const val MIN_USERNAME_LENGTH = 3
        const val MAX_USERNAME_LENGTH = 20
        const val MIN_PASSWORD_LENGTH = 6
        const val MAX_PASSWORD_LENGTH = 100
    }

    private val avatarsBucket = "avatars"
    private val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$".toRegex()

    @Transactional
    fun createUser(
        authenticationProvider: AuthenticationProvider,
        email: String,
        username: String,
        password: String?
    ): UserResponse {
        if (username.length !in MIN_USERNAME_LENGTH..MAX_USERNAME_LENGTH) throw UserUsernameInvalidError()

        if (password != null) {
            if (password.length !in MIN_PASSWORD_LENGTH..MAX_PASSWORD_LENGTH) throw UserPasswordInvalidError()
        }

        // validate email
        if (!email.matches(emailRegex)) {
            throw UserEmailInvalidError()
        }

        // check if user already exists
        if (doesUserExist(email)) {
            throw UserEmailAlreadyTakenError()
        }

        return userRepository
            .save(
                User(
                    id = null,
                    email = email,
                    username = username,
                    password = password?.let { passwordEncoder.encode(it) },
                    verified = false,
                    totpSecret = null,
                    decimalSeparator = ".",
                    groupSeparator = ",",
                    authenticationProvider = authenticationProvider
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

        // validate email
        if (!email.matches(emailRegex)) {
            throw UserEmailInvalidError()
        }

        user.email = email
    }

    @Transactional
    fun updateUserPassword(requesterId: Int, securityCode: String, oldPassword: String, newPassword: String) {
        val user = userRepository.findById(requesterId) ?: throw UserAccessDeniedError()

        if (newPassword.length !in MIN_PASSWORD_LENGTH..MAX_PASSWORD_LENGTH) throw UserPasswordInvalidError()

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

        if (username.length !in MIN_USERNAME_LENGTH..MAX_USERNAME_LENGTH) throw UserUsernameInvalidError()
        if (decimalSeparator.length != 1) throw UserDecimalSeparatorInvalidError()
        if (groupSeparator.length != 1) throw UserGroupSeparatorInvalidError()

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
            ?.toResponse()
            ?: throw UserAccessDeniedError()

    @Transactional(readOnly = true)
    fun findUser(userId: Int): UserResponse? =
        userRepository.findById(userId)
            ?.toResponse()

    @Transactional(readOnly = true)
    fun findUser(email: String): UserResponse? =
        userRepository.findByEmail(email)
            ?.toResponse()

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
                    password = it.password ?: return@let null,
                    verified = it.verified,
                    totpSecret = it.totpSecret
                )
            }

    @Transactional(readOnly = true)
    fun getUserAvatar(userId: Int): InputStream =
        storageClient.loadFile(avatarsBucket, userId.toString()) ?: throw UserAccessDeniedError()

}
