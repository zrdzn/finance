package dev.zrdzn.finance.backend.common.customer

import dev.zrdzn.finance.backend.common.user.UserId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

typealias CustomerId = Int

@Entity("Customer")
@Table("customers")
data class Customer(
    @Id
    @Column("id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: CustomerId?,

    @Column("user_id")
    val userId: UserId
)
