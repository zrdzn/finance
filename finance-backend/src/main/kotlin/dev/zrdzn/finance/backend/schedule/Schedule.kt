package dev.zrdzn.finance.backend.schedule

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