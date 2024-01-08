package dev.zrdzn.finance.backend.common.product

interface CategoryRepository {

    fun save(category: Category): Category

}