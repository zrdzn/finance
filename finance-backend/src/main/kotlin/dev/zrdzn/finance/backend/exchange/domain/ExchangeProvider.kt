package dev.zrdzn.finance.backend.exchange.domain

interface ExchangeProvider {

    fun getExchangeRates(): List<ExchangeRate>

}