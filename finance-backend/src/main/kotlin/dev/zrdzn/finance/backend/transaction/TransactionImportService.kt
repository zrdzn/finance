package dev.zrdzn.finance.backend.transaction

import com.opencsv.CSVParserBuilder
import com.opencsv.CSVReaderBuilder
import com.opencsv.enums.CSVReaderNullFieldIndicator
import dev.zrdzn.finance.backend.transaction.dto.TransactionCreateRequest
import dev.zrdzn.finance.backend.transaction.error.TransactionImportMappingNotFoundError
import dev.zrdzn.finance.backend.transaction.error.TransactionPriceRequiredError
import java.io.InputStream
import java.io.InputStreamReader
import java.math.BigDecimal
import java.util.Locale
import org.springframework.stereotype.Service

@Service
class TransactionImportService {

    fun importFromCsv(
        vaultId: Int,
        separator: Char,
        fileData: InputStream,
        mappings: Map<String, String>,
        applyTransactionMethod: TransactionMethod?
    ): Set<TransactionCreateRequest> {
        val records = readAllRecords(fileData, separator)

        val header = records.first()
        val columns = mapColumns(header, mappings)

        val transactions = mutableSetOf<TransactionCreateRequest>()

        for (record in records.drop(1)) {
            val values = try {
                mapOf(
                    "createdAt" to record.getOrNull(columns["createdAt"] ?: -1),
                    "transactionMethod" to record.getOrNull(columns["transactionMethod"] ?: -1),
                    "description" to record.getOrNull(columns["description"] ?: -1),
                    "total" to record.getOrNull(columns["total"] ?: -1),
                    "currency" to record.getOrNull(columns["currency"] ?: -1),
                    "rawPrice" to record.getOrNull(columns["rawPrice"] ?: -1)
                )
            } catch (e: NoSuchElementException) {
                throw TransactionImportMappingNotFoundError()
            }

            val transactionMethod = applyTransactionMethod ?: values["transactionMethod"]
                ?.let { TransactionMethod.valueOf(it) }
                ?: throw TransactionImportMappingNotFoundError()

            val description = values["description"] ?: throw TransactionImportMappingNotFoundError()
            val totalString = values["total"]
            val currency = values["currency"]
            val rawPrice = values["rawPrice"]

            val (total, finalCurrency) = extractPrice(totalString, currency, rawPrice)

            val transactionType = extractTransactionType(total)

            transactions.add(
                TransactionCreateRequest(
                    vaultId = vaultId,
                    transactionMethod = transactionMethod,
                    transactionType = transactionType,
                    description = description,
                    price = total.abs(),
                    currency = finalCurrency,
                    products = emptySet(),
                )
            )
        }

        return transactions
    }

    private fun readAllRecords(fileData: InputStream, separator: Char): List<Array<String>> {
        val reader = InputStreamReader(fileData)

        val csvParser = CSVParserBuilder()
            .withSeparator(separator)
            .withQuoteChar('"')
            .withEscapeChar('\\')
            .withStrictQuotes(false)
            .withIgnoreLeadingWhiteSpace(true)
            .withIgnoreQuotations(false)
            .withFieldAsNull(CSVReaderNullFieldIndicator.NEITHER)
            .withErrorLocale(Locale.getDefault())
            .build()

        val csvReader = CSVReaderBuilder(reader)
            .withCSVParser(csvParser)
            .build()

        return csvReader.readAll()
    }

    private fun mapColumns(header: Array<String>, mappings: Map<String, String>): Map<String, Int> {
        return mappings.mapValues { (_, columnName) ->
            header.indexOf(columnName).takeIf { it >= 0 } ?: throw IllegalArgumentException("Column $columnName not found in CSV header")
        }
    }

    private fun extractPrice(totalString: String?, currency: String?, rawPrice: String?): Pair<BigDecimal, String> =
        when {
            !rawPrice.isNullOrBlank() -> {
                val (parsedTotal, parsedCurrency) = parseRawPrice(rawPrice)
                parsedTotal to (currency ?: parsedCurrency)
            }
            !totalString.isNullOrBlank() -> {
                totalString.replace(" ", "").replace(",", ".").toBigDecimal() to (currency ?: throw TransactionImportMappingNotFoundError())
            }
            else -> throw TransactionPriceRequiredError()
        }

    private fun extractTransactionType(total: BigDecimal): TransactionType =
        when {
            total > BigDecimal.ZERO -> TransactionType.INCOMING
            total < BigDecimal.ZERO -> TransactionType.OUTGOING
            else -> throw TransactionPriceRequiredError()
        }

    private fun parseRawPrice(rawPrice: String): Pair<BigDecimal, String> {
        val rawPriceCleaned = rawPrice.replace(" ", "").replace(",", ".")

        val regex = Regex("""^([A-Za-z]{3})?(-?\d{1,3}(?:\d{3})*(?:[.,]\d+)?)([A-Za-z]{3})?$""")

        val matchResult = regex.find(rawPriceCleaned) ?: throw IllegalArgumentException("Invalid rawPrice format")

        val groups = matchResult.groups
        val amount = groups[2]?.value
        val currency = (groups[1]?.value ?: "") + (groups[3]?.value ?: "")

        if (currency.isEmpty() || amount == null) {
            throw IllegalArgumentException("Invalid rawPrice format: missing currency or amount")
        }

        return BigDecimal(amount) to currency.trim().uppercase()
    }

}