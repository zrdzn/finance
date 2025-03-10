package dev.zrdzn.finance.backend.user;

import dev.samstevens.totp.qr.QrDataFactory
import dev.samstevens.totp.qr.QrGenerator
import dev.samstevens.totp.secret.SecretGenerator
import dev.samstevens.totp.util.Utils.getDataUriForImage
import dev.zrdzn.finance.backend.user.dto.TwoFactorSetupResponse
import org.springframework.stereotype.Service

@Service
class TwoFactorCodeGenerator(
    private val secretGenerator: SecretGenerator,
    private val qrDataFactory: QrDataFactory,
    private val qrGenerator: QrGenerator
) {

    fun generateTwoFactorSecret(email: String): TwoFactorSetupResponse {
        val secret = secretGenerator.generate()

        val data = qrDataFactory.newBuilder()
            .label(email)
            .secret(secret)
            .issuer("Finance")
            .build()

        val qrCodeImage = getDataUriForImage(
            qrGenerator.generate(data),
            qrGenerator.imageMimeType
        )

        return TwoFactorSetupResponse(
            qrCodeImage = qrCodeImage,
            secret = secret
        )
    }

}
