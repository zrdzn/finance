package dev.zrdzn.finance.backend.audit

import dev.zrdzn.finance.backend.audit.api.AuditAction
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType

typealias AuditId = Int

@Entity(name = "Audit")
@Table(name = "audits")
data class Audit(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: AuditId?,

    @Column(name = "created_at")
    val createdAt: Instant,

    @Column(name = "vault_id")
    val vaultId: VaultId,

    @Column(name = "user_id")
    val userId: UserId,

    @Column(columnDefinition = "audit_action")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    var auditAction: AuditAction,

    @Column(name = "description")
    val description: String,
)