package dev.zrdzn.finance.backend.common.exchange

import dev.zrdzn.finance.backend.api.exchange.ExchangeRate

interface ExchangeProvider {

    fun getExchangeRates(): List<ExchangeRate>

}