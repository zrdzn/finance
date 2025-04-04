export type AccountUpdateType = "EMAIL" | "PASSWORD" | "TWO_FACTOR"

export type VaultRole = "OWNER" | "MANAGER" | "MEMBER"

export type TransactionMethod = "CARD" | "BLIK" | "CASH"
export type TransactionType = "INCOMING" | "OUTGOING"
export type TransactionFlowsRange = "DAY" | "WEEK" | "MONTH" | "YEAR"

export type ScheduleInterval = "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR"

export type AnalyticsOverviewStatisticType = "BALANCE" | "INCOME" | "EXPENSES"

export type SelectOptionProperties = {value: string, label: string}
export type SelectProperties = SingleValue<SelectOptionProperties>
