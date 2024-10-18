package dev.zrdzn.finance.backend.user

import dev.zrdzn.finance.backend.user.api.UserAccessDeniedException
import dev.zrdzn.finance.backend.user.api.UserCreateRequest
import dev.zrdzn.finance.backend.user.api.UserCreateResponse
import dev.zrdzn.finance.backend.user.api.UserNotFoundByEmailException
import dev.zrdzn.finance.backend.user.api.UserNotFoundException
import dev.zrdzn.finance.backend.user.api.UserResponse
import dev.zrdzn.finance.backend.user.api.UserWithPasswordResponse
import dev.zrdzn.finance.backend.user.api.UsernameResponse
import org.slf4j.LoggerFactory
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.transaction.annotation.Transactional

open class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val userProtectionService: UserProtectionService
) {

    private val logger = LoggerFactory.getLogger(UserService::class.java)

    @Transactional
    open fun createUser(userCreateRequest: UserCreateRequest): UserCreateResponse =
        userRepository
            .save(
                User(
                    id = null,
                    email = userCreateRequest.email,
                    username = userCreateRequest.username,
                    password = passwordEncoder.encode(userCreateRequest.password),
                    verified = false
                )
            )
            .let { UserCreateResponse(it.id!!) }

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
    open fun getUserById(id: UserId): UserResponse =
        userRepository.findById(id)
            ?.let {
                UserResponse(
                    id = it.id!!,
                    email = it.email,
                    username = it.username,
                    verified = it.verified
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