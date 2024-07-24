package dev.zrdzn.finance.backend.exchange

import dev.zrdzn.finance.backend.exchange.api.ExchangeRate

interface ExchangeProvider {

    fun getExchangeRates(): List<ExchangeRate>

}