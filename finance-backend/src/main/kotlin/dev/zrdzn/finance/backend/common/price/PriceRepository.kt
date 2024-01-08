package dev.zrdzn.finance.backend.common.price

interface PriceRepository {

    fun save(price: Price): Price

}