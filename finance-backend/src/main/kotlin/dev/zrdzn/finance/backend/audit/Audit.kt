package dev.zrdzn.finance.backend.audit

import dev.zrdzn.finance.backend.vault.VaultMemberId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

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

    @Column(name = "member_id")
    val memberId: VaultMemberId,

    @Column(name = "description")
    val description: String,
)