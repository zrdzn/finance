package dev.zrdzn.finance.backend.audit.infrastructure

import dev.zrdzn.finance.backend.audit.domain.Audit
import dev.zrdzn.finance.backend.audit.domain.AuditRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaAuditRepository : AuditRepository, Repository<Audit, Int>
