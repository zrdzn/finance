package dev.zrdzn.finance.backend.shared

import jakarta.servlet.http.HttpServletRequest

fun HttpServletRequest.getBaseUrl(): String =
    this.scheme + "://" + this.serverName + ":" + this.serverPort