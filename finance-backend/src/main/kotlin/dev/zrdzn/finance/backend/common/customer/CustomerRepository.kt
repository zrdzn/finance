package dev.zrdzn.finance.backend.common.customer

interface CustomerRepository {

    fun save(customer: Customer): Customer

}