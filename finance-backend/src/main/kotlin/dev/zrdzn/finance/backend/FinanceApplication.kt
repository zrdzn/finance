package dev.zrdzn.finance.backend

import dev.samstevens.totp.spring.autoconfigure.TotpAutoConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.context.annotation.Import
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.transaction.annotation.EnableTransactionManagement

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableJpaRepositories
@EnableTransactionManagement
@EnableAsync
@EnableScheduling
@Import(TotpAutoConfiguration::class)
class FinanceApplication
