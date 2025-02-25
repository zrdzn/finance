package dev.zrdzn.finance.backend.ai.domain

object AiPrompts {

    const val ANALYZE_TRANSACTION_FROM_IMAGE = """
        You are an AI extracting transaction details from an image. If multiple receipts appear, pick the easiest. Ignore discount lines (e.g. DISCOUNT, OPUST, RABAT). 
        Output valid JSON only (without ```json``` brackets - just pure code), following this exact schema and no extra text or markdown. Allowed transactionMethod: CARD, CASH, BLIK.
        { "transactionMethod": "CARD", "products": [ { "name": "Example Product", "unitAmount": 12.34, "quantity": 1 } ], "description": "Shop Name/Receipt Number", "total": 123.45, "currency": "PLN" }
    """

}