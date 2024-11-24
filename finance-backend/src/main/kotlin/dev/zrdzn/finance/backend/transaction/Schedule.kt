package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.transaction.api.schedule.ScheduleInterval
import jakarta.persistence.*
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import java.time.Instant

@Entity(name = "Schedule")
@Table(name = "schedules")
data class Schedule(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,

    @Column(name = "transaction_id")
    val transactionId: Int,

    @Column(name = "description")
    var description: String,

    @Column(name = "next_execution")
    var nextExecution: Instant,

    @Column(columnDefinition = "schedule_interval")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val scheduleInterval: ScheduleInterval,

    @Column(name = "interval_value")
    val intervalValue: Int
)