package dev.zrdzn.finance.backend.common.price.infrastructure

import dev.zrdzn.finance.backend.common.price.Price
import dev.zrdzn.finance.backend.common.price.PriceId
import dev.zrdzn.finance.backend.common.price.PriceRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaPriceRepository : PriceRepository, Repository<Price, PriceId>