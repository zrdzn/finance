package dev.zrdzn.finance.backend.user

import dev.samstevens.totp.code.CodeVerifier
import dev.zrdzn.finance.backend.storage.StorageClient
import dev.zrdzn.finance.backend.user.api.*
import dev.zrdzn.finance.backend.user.api.security.TwoFactorAlreadyEnabledException
import dev.zrdzn.finance.backend.user.api.security.TwoFactorSetupResponse
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.transaction.annotation.Transactional
import java.io.InputStream

open class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val userProtectionService: UserProtectionService,
    private val twoFactorCodeGenerator: TwoFactorCodeGenerator,
    private val codeVerifier: CodeVerifier,
    private val storageClient: StorageClient
) {

    private val avatarsBucket = "avatars"

    @Transactional
    open fun createUser(userCreateRequest: UserCreateRequest): UserResponse {
        if (doesUserExist(userCreateRequest.email)) {
            throw UserEmailAlreadyTakenException()
        }

        return userRepository
            .save(
                User(
                    id = null,
                    email = userCreateRequest.email,
                    username = userCreateRequest.username,
                    password = passwordEncoder.encode(userCreateRequest.password),
                    verified = false,
                    totpSecret = null
                )
            )
            .toResponse()
    }

    @Transactional
    open fun requestUserUpdate(requesterId: Int) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException()

        userProtectionService.sendUserUpdateCode(user.id!!, user.email)
    }

    @Transactional
    open fun requestUserVerification(requesterId: Int, verificationLink: String) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException()

        userProtectionService.sendUserVerificationLink(user.id!!, user.email, verificationLink)
    }

    @Transactional
    open fun requestUserTwoFactorSetup(requesterId: Int, securityCode: String): TwoFactorSetupResponse {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException()

        if (!userProtectionService.isAccessGranted(userId = user.id!!, securityCode = securityCode)) {
            throw UserAccessDeniedException()
        }

        if (user.totpSecret != null) {
            throw TwoFactorAlreadyEnabledException()
        }

        return twoFactorCodeGenerator.generateTwoFactorSecret(user.email)
    }

    @Transactional
    open fun verifyUserTwoFactorSetup(requesterId: Int, secret: String, oneTimePassword: String) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException()

        if (!codeVerifier.isValidCode(secret, oneTimePassword)) {
            throw UserAccessDeniedException()
        }

        user.totpSecret = secret
    }

    @Transactional(readOnly = true)
    open fun verifyUserTwoFactorCode(secret: String, oneTimePassword: String): Boolean {
        return codeVerifier.isValidCode(secret, oneTimePassword)
    }

    @Transactional
    open fun updateUserEmail(requesterId: Int, securityCode: String, email: String) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException()

        if (!userProtectionService.isAccessGranted(userId = user.id!!, securityCode = securityCode)) {
            throw UserAccessDeniedException()
        }

        user.email = email
    }

    @Transactional
    open fun updateUserPassword(requesterId: Int, securityCode: String, oldPassword: String, newPassword: String) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException()

        if (!userProtectionService.isAccessGranted(userId = user.id!!, securityCode = securityCode)) {
            throw UserAccessDeniedException()
        }

        if (!passwordEncoder.matches(oldPassword, user.password)) {
            throw UserAccessDeniedException()
        }

        user.password = passwordEncoder.encode(newPassword)
    }

    @Transactional
    open fun updateUserProfile(requesterId: Int, username: String) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException()

        user.username = username
    }

    @Transactional
    open fun verifyUser(requesterId: Int, securityCode: String) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException()

        if (!userProtectionService.isAccessGranted(userId = user.id!!, securityCode = securityCode)) {
            throw UserAccessDeniedException()
        }

        user.verified = true
    }

    @Transactional
    open fun updateUserAvatar(requesterId: Int, avatar: ByteArray) {
        userRepository.findById(requesterId) ?: throw UserNotFoundException()

        storageClient.saveFile(avatarsBucket, requesterId.toString(), data = avatar.inputStream())
    }

    @Transactional(readOnly = true)
    open fun doesUserExist(email: String): Boolean =
        userRepository.findByEmail(email) != null

    @Transactional(readOnly = true)
    open fun getUser(userId: Int): UserResponse =
        userRepository.findById(userId)
            ?.let {
                UserResponse(
                    id = it.id!!,
                    email = it.email,
                    username = it.username,
                    verified = it.verified,
                    isTwoFactorEnabled = it.totpSecret != null
                )
            }
            ?: throw UserNotFoundException()

    @Transactional(readOnly = true)
    open fun getUserId(username: String): Int =
        userRepository.findIdByUsername(username) ?: throw UserNotFoundException()

    @Transactional(readOnly = true)
    open fun getUsername(userId: Int): UsernameResponse =
        UsernameResponse(getUser(userId).username)

    @Transactional(readOnly = true)
    open fun getInsecureUser(email: String): UserWithPasswordResponse =
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
            ?: throw UserNotFoundByEmailException()

    @Transactional(readOnly = true)
    open fun getUserAvatar(username: String): InputStream =
        getUserId(username)
            .let { storageClient.loadFile(avatarsBucket, it.toString()) }
            ?: throw UserNotFoundException()

}
