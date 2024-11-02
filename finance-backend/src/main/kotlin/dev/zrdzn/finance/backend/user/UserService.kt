package dev.zrdzn.finance.backend.user

import dev.samstevens.totp.code.CodeVerifier
import dev.zrdzn.finance.backend.user.api.*
import dev.zrdzn.finance.backend.user.api.security.TwoFactorSetupResponse
import dev.zrdzn.finance.backend.user.api.security.TwoFactorAlreadyEnabledException
import dev.zrdzn.finance.backend.user.api.security.TwoFactorNotEnabledException
import dev.zrdzn.finance.backend.user.api.security.UserAccessDeniedException
import org.slf4j.LoggerFactory
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.transaction.annotation.Transactional

open class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val userProtectionService: UserProtectionService,
    private val twoFactorCodeGenerator: TwoFactorCodeGenerator,
    private val codeVerifier: CodeVerifier
) {

    private val logger = LoggerFactory.getLogger(UserService::class.java)

    @Transactional
    open fun createUser(userCreateRequest: UserCreateRequest): UserCreateResponse {
        if (doesUserExistByEmail(userCreateRequest.email)) {
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
            .let { UserCreateResponse(it.id!!) }
    }

    @Transactional
    open fun requestUserUpdate(requesterId: UserId) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException(requesterId)

        userProtectionService.sendUserUpdateCode(user.id!!, user.email)
    }

    @Transactional
    open fun requestUserVerification(requesterId: UserId, verificationLink: String) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException(requesterId)

        userProtectionService.sendUserVerificationLink(user.id!!, user.email, verificationLink)
    }

    @Transactional
    open fun requestUserTwoFactorSetup(requesterId: UserId, securityCode: String): TwoFactorSetupResponse {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException(requesterId)

        if (!userProtectionService.isAccessGranted(userId = user.id!!, securityCode = securityCode)) {
            throw UserAccessDeniedException(requesterId)
        }

        if (user.totpSecret != null) {
            throw TwoFactorAlreadyEnabledException()
        }

        return twoFactorCodeGenerator.generateTwoFactorSecret(user.email)
    }

    @Transactional
    open fun verifyUserTwoFactorSetup(requesterId: UserId, secret: String, oneTimePassword: String) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException(requesterId)

        if (!codeVerifier.isValidCode(secret, oneTimePassword)) {
            throw UserAccessDeniedException(requesterId)
        }

        user.totpSecret = secret

        logger.info("User with id $requesterId has enabled two-factor authentication")
    }

    @Transactional
    open fun updateUserEmail(requesterId: UserId, securityCode: String, email: String) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException(requesterId)

        if (!userProtectionService.isAccessGranted(userId = user.id!!, securityCode = securityCode)) {
            throw UserAccessDeniedException(requesterId)
        }

        user.email = email

        logger.info("User with id $requesterId has updated email")
    }

    @Transactional
    open fun updateUserPassword(requesterId: UserId, securityCode: String, oldPassword: String, newPassword: String) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException(requesterId)

        if (!userProtectionService.isAccessGranted(userId = user.id!!, securityCode = securityCode)) {
            throw UserAccessDeniedException(requesterId)
        }

        if (!passwordEncoder.matches(oldPassword, user.password)) {
            throw UserAccessDeniedException(requesterId)
        }

        user.password = passwordEncoder.encode(newPassword)

        logger.info("User with id $requesterId has updated password")
    }

    @Transactional
    open fun updateUserProfile(requesterId: UserId, username: String) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException(requesterId)

        user.username = username

        logger.info("User with id $requesterId updated username to $username")
    }

    @Transactional
    open fun verifyUser(requesterId: UserId, securityCode: String) {
        val user = userRepository.findById(requesterId) ?: throw UserNotFoundException(requesterId)

        if (!userProtectionService.isAccessGranted(userId = user.id!!, securityCode = securityCode)) {
            throw UserAccessDeniedException(requesterId)
        }

        user.verified = true

        logger.info("User with id $requesterId has verified his account")
    }

    @Transactional(readOnly = true)
    open fun doesUserExistByEmail(email: String): Boolean =
        userRepository.findByEmail(email) != null

    @Transactional(readOnly = true)
    open fun getUserById(id: UserId): UserResponse =
        userRepository.findById(id)
            ?.let {
                UserResponse(
                    id = it.id!!,
                    email = it.email,
                    username = it.username,
                    verified = it.verified,
                    isTwoFactorEnabled = it.totpSecret != null
                )
            }
            ?: throw UserNotFoundException(id)

    @Transactional(readOnly = true)
    open fun getUsernameByUserId(id: UserId): UsernameResponse =
        UsernameResponse(getUserById(id).username)

    @Transactional(readOnly = true)
    open fun getUserWithPasswordByEmail(email: String): UserWithPasswordResponse =
        userRepository
            .findByEmail(email)
            ?.let {
                UserWithPasswordResponse(
                    id = it.id!!,
                    email = it.email,
                    username = it.username,
                    password = it.password,
                    verified = it.verified
                )
            }
            ?: throw UserNotFoundByEmailException(email)


}
