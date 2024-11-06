package dev.zrdzn.finance.backend.user

import dev.zrdzn.finance.backend.mail.MailService
import dev.zrdzn.finance.backend.shared.createRandomNumberToken
import java.security.MessageDigest
import java.time.Clock
import java.time.Instant
import java.time.temporal.ChronoUnit

class UserProtectionService(
    private val mailService: MailService,
    private val clock: Clock
) {

    private val digest = MessageDigest.getInstance("SHA-256")
    private val activeCodes = mutableMapOf<String, Pair<UserId, Instant>>()

    fun sendUserUpdateCode(userId: UserId, userEmail: String) {
        val securityCode = prepareSecurityCode(userId)

        mailService.sendMail(
            userEmail,
            "Account Update Code",
            "Security code to update your account is: $securityCode"
        )
    }

    fun sendUserVerificationLink(userId: UserId, userEmail: String, verificationLink: String) {
        val securityCode = prepareSecurityCode(userId)

        mailService.sendMail(
            userEmail,
            "Account Verification Link",
            "Link to verify your account: $verificationLink?securityCode=$securityCode"
        )
    }

    fun isAccessGranted(userId: UserId, securityCode: String): Boolean {
        val hashedSecurityCode = hashCode(securityCode)

        val userIdWithExpirationDate = activeCodes[hashedSecurityCode] ?: return false
        if (userIdWithExpirationDate.second.isBefore(Instant.now(clock))) {
            activeCodes.remove(hashedSecurityCode)
            return false
        }

        if (userIdWithExpirationDate.first != userId) {
            return false
        }

        return true
    }

    private fun prepareSecurityCode(userId: UserId): String {
        val securityCode = createRandomNumberToken(6)
        activeCodes[hashCode(securityCode)] = Pair(userId, Instant.now(clock).plus(10, ChronoUnit.MINUTES))
        return securityCode
    }

    private fun hashCode(rawCode: String): String {
        val hashBytes = digest.digest(rawCode.toByteArray())
        return hashBytes.joinToString("") { "%02x".format(it) }
    }

}
