package dev.zrdzn.finance.backend.common.exchange

import com.github.benmanes.caffeine.cache.Caffeine
import dev.zrdzn.finance.backend.api.exchange.ExchangeRate
import dev.zrdzn.finance.backend.api.price.Price
import dev.zrdzn.finance.backend.api.shared.Currency
import java.math.BigDecimal
import java.math.RoundingMode
import java.util.concurrent.TimeUnit

class ExchangeService(
    private val exchangeProvider: ExchangeProvider
) {

    private val exchangeRates = Caffeine.newBuilder()
        .expireAfterAccess(2, TimeUnit.HOURS)
        .build<Currency, List<ExchangeRate>>()

    fun convertCurrency(amount: BigDecimal, source: Currency, target: Currency): Price {
        val rates = exchangeRates.get("PLN") { exchangeProvider.getExchangeRates() }
        val sourceRate = rates.first { it.currency == source }.rate
        val targetRate = rates.first { it.currency == target }.rate

        return when {
            // Convert from PLN to target currency
            source == "PLN" -> {
                val convertedAmount = amount.divide(targetRate, RoundingMode.HALF_UP)
                Price(
                    currency = target,
                    amount = convertedAmount
                )
            }

            // Convert from source currency to PLN
            target == "PLN" -> {
                val convertedAmount = amount.multiply(sourceRate)
                Price(
                    currency = target,
                    amount = convertedAmount
                )
            }

            // Convert from source currency to PLN, then to target currency
            else -> {
                val plnAmount = amount.multiply(sourceRate)
                val convertedAmount = plnAmount.divide(targetRate, RoundingMode.HALF_UP)
                Price(
                    currency = target,
                    amount = convertedAmount
                )
            }
        }
    }

    fun synchronizeExchangeRates(): List<ExchangeRate> {
        val rates = exchangeProvider.getExchangeRates()
        exchangeRates.put("PLN", rates)
        return rates
    }

}
