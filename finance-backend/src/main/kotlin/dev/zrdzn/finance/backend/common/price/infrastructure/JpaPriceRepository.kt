package dev.zrdzn.finance.backend.common.price.infrastructure

import dev.zrdzn.finance.backend.common.price.Price
import dev.zrdzn.finance.backend.common.price.PriceId
import dev.zrdzn.finance.backend.common.price.PriceRepository
import org.springframework.data.repository.Repository

interface JpaPriceRepository : PriceRepository, Repository<PriceId, Price>