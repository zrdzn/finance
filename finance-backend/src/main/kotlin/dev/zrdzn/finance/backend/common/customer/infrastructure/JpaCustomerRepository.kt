package dev.zrdzn.finance.backend.common.customer.infrastructure

import dev.zrdzn.finance.backend.common.customer.Customer
import dev.zrdzn.finance.backend.common.customer.CustomerId
import dev.zrdzn.finance.backend.common.customer.CustomerRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaCustomerRepository : CustomerRepository, Repository<CustomerId, Customer>