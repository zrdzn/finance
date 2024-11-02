package dev.zrdzn.finance.backend.audit.infrastructure

import dev.zrdzn.finance.backend.audit.Audit
import dev.zrdzn.finance.backend.audit.AuditId
import dev.zrdzn.finance.backend.audit.AuditRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component

@Component
interface JpaAuditRepository : AuditRepository, Repository<Audit, AuditId>
