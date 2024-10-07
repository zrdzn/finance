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

    fun requestProtectedResources(userId: UserId, userEmail: String) {
        val securityCode = createRandomNumberToken(6)
        activeCodes[hashCode(securityCode)] = Pair(userId, Instant.now(clock).plus(10, ChronoUnit.MINUTES))

        mailService.sendMail(
            userEmail,
            "Access code",
            "Your access code is: $securityCode"
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

    private fun hashCode(rawCode: String): String {
        val hashBytes = digest.digest(rawCode.toByteArray())
        return hashBytes.joinToString("") { "%02x".format(it) }
    }

}