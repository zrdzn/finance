package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.user.api.UserResponse
import dev.zrdzn.finance.backend.vault.api.authority.VaultRole
import dev.zrdzn.finance.backend.vault.api.member.VaultMemberResponse
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType

@Entity
@Table(name = "vault_members")
data class VaultMember(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,

    @Column(name = "vault_id")
    val vaultId: Int,

    @Column(name = "user_id")
    val userId: Int,

    @Column(columnDefinition = "vault_role")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    var vaultRole: VaultRole,
)

fun VaultMember.toResponse(user: UserResponse) = VaultMemberResponse(
    id = id!!,
    vaultId = vaultId,
    user = user,
    vaultRole = vaultRole
)