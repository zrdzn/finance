package dev.zrdzn.finance.backend.common.exchange.infrastructure

import dev.zrdzn.finance.backend.api.exchange.ExchangeRate
import dev.zrdzn.finance.backend.common.exchange.ExchangeProvider
import kong.unirest.core.HttpResponse
import kong.unirest.core.JsonNode
import kong.unirest.core.Unirest
import kong.unirest.core.json.JSONObject

class NbpExchangeProvider : ExchangeProvider {

    override fun getExchangeRates(): List<ExchangeRate> {
        val exchangeRates = mutableListOf(ExchangeRate("PLN", 1.toBigDecimal()))

        // get all exchange rates from table A (popular currencies)
        Unirest.get("https://api.nbp.pl/api/exchangerates/tables/a?format=JSON")
            .asJson()
            .ifSuccess { exchangeRates.addAll(getRates(it)) }

        // get all exchange rates from table B (less popular currencies)
        Unirest.get("https://api.nbp.pl/api/exchangerates/tables/b?format=JSON")
            .asJson()
            .ifSuccess { exchangeRates.addAll(getRates(it)) }

        return exchangeRates
    }

    private fun getRates(response: HttpResponse<JsonNode>): List<ExchangeRate> =
        response.body.array.getJSONObject(0).getJSONArray("rates")
            .toList()
            .map { it as JSONObject }
            .map {
                ExchangeRate(
                    currency = it.getString("code"),
                    rate = it.getDouble("mid").toBigDecimal()
                )
            }

}