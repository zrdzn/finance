package dev.zrdzn.finance.backend.audit

import dev.zrdzn.finance.backend.audit.api.AuditAction
import dev.zrdzn.finance.backend.audit.api.AuditResponse
import dev.zrdzn.finance.backend.user.api.UserResponse
import dev.zrdzn.finance.backend.vault.api.VaultResponse
import jakarta.persistence.*
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import java.time.Instant

@Table(name = "audits")
data class Audit(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,

    @Column(name = "created_at")
    val createdAt: Instant,

    @Column(name = "vault_id")
    val vaultId: Int,

    @Column(name = "user_id")
    val userId: Int,

    @Column(columnDefinition = "audit_action")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    var auditAction: AuditAction,

    @Column(name = "description")
    val description: String,
)

fun Audit.toResponse(vault: VaultResponse, user: UserResponse) = AuditResponse(
    id = this.id!!,
    createdAt = this.createdAt,
    vault = vault,
    user = user,
    auditAction = this.auditAction,
    description = this.description
)