package dev.zrdzn.finance.backend.common.user

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.Size

typealias UserId = Int

@Entity(name = "User")
@Table(name = "users")
data class User(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: UserId?,

    @Column(name = "email")
    val email: String,

    @Column(name = "username")
    val username: String,

    @Column(name = "password")
    @Size(max = 100)
    val password: String,
)