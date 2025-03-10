package dev.zrdzn.finance.backend.exchange

interface ExchangeProvider {

    fun getExchangeRates(): List<ExchangeRate>

}