package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.api.authority.VaultRole
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType

typealias VaultMemberId = Int

@Entity(name = "VaultMember")
@Table(name = "vault_members")
data class VaultMember(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: VaultMemberId?,

    @Column(name = "vault_id")
    val vaultId: VaultId,

    @Column(name = "user_id")
    val userId: UserId,

    @Column(columnDefinition = "vault_role")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    var vaultRole: VaultRole,
)