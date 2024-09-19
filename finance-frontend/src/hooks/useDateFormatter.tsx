import {useCallback} from "react"

export const useDateFormatter = () => {
  const formatDate = useCallback((timestamp: number, showTime: boolean) => {
    const date = new Date(timestamp * 1000)

    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    return showTime ? `${formattedDate} (${formattedTime})` : formattedDate
  }, [])

  return { formatDate }
}