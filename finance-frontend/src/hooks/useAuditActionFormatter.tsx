import {useCallback} from "react"

export const useAuditActionFormatter = () => {
  const formatAuditAction = useCallback((action: string) => {
    const auditActionsMap: { [key: string]: string } = {
      TRANSACTION_CREATED: "New transaction created",
      TRANSACTION_UPDATED: "Transaction updated",
      TRANSACTION_DELETED: "Transaction deleted",
      TRANSACTION_EXPORTED: "Transactions exported",
      TRANSACTION_PRODUCT_CREATED: "Product added to transaction",
      CATEGORY_CREATED: "New category created",
      CATEGORY_DELETED: "Category deleted",
      PRODUCT_CREATED: "New product created",
      PRODUCT_UPDATED: "Product updated",
      PRODUCT_DELETED: "Product deleted",
    }

    return auditActionsMap[action] || action;
  }, [])

  return { formatAuditAction };
}