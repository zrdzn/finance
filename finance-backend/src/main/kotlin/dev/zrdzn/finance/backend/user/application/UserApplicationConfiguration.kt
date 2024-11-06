package dev.zrdzn.finance.backend.user.application

import dev.samstevens.totp.code.CodeVerifier
import dev.samstevens.totp.qr.QrDataFactory
import dev.samstevens.totp.qr.QrGenerator
import dev.samstevens.totp.secret.SecretGenerator
import dev.samstevens.totp.spring.autoconfigure.TotpAutoConfiguration
import dev.zrdzn.finance.backend.mail.MailService
import dev.zrdzn.finance.backend.user.TwoFactorCodeGenerator
import dev.zrdzn.finance.backend.user.UserProtectionService
import dev.zrdzn.finance.backend.user.UserRepository
import dev.zrdzn.finance.backend.user.UserService
import java.time.Clock
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
@Import(TotpAutoConfiguration::class)
class UserApplicationConfiguration(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val clock: Clock,
    private val mailService: MailService,
    private val secretGenerator: SecretGenerator,
    private val qrDataFactory: QrDataFactory,
    private val qrGenerator: QrGenerator,
    private val codeVerifier: CodeVerifier,
) {

    @Bean
    fun userService(): UserService = UserService(
        userRepository = userRepository,
        passwordEncoder = passwordEncoder,
        userProtectionService = userProtectionService(),
        twoFactorCodeGenerator = totpCodeGenerator(),
        codeVerifier = codeVerifier,
    )

    @Bean
    fun userProtectionService(): UserProtectionService = UserProtectionService(
        clock = clock,
        mailService = mailService,
    )

    @Bean
    fun totpCodeGenerator(): TwoFactorCodeGenerator = TwoFactorCodeGenerator(
        secretGenerator = secretGenerator,
        qrDataFactory = qrDataFactory,
        qrGenerator = qrGenerator,
    )

}
