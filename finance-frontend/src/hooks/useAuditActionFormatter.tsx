import {useCallback} from "react"

export const useAuditActionFormatter = () => {
  const formatAuditAction = useCallback((action: string) => {
    const auditActionsMap: { [key: string]: string } = {
      PAYMENT_CREATED: "New payment created",
      PAYMENT_UPDATED: "Payment updated",
      PAYMENT_DELETED: "Payment deleted",
      PAYMENT_EXPORTED: "Payments exported",
      PAYMENT_PRODUCT_CREATED: "Product added to payment",
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