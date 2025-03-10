package dev.zrdzn.finance.backend.audit

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType

@Entity
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