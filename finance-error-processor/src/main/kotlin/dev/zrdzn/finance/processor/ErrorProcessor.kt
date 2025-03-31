package dev.zrdzn.finance.processor

import com.google.devtools.ksp.processing.Resolver
import com.google.devtools.ksp.processing.SymbolProcessor
import com.google.devtools.ksp.symbol.KSAnnotated
import com.google.devtools.ksp.symbol.KSClassDeclaration

class ErrorProcessor : SymbolProcessor {

    override fun process(resolver: Resolver): List<KSAnnotated> {
        val errorEnum = resolver.getSymbolsWithAnnotation(FinanceError::class.qualifiedName!!)
            .filterIsInstance<KSClassDeclaration>()
    }

}