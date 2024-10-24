import {useCallback} from "react"

export const useDateFormatter = () => {
  const formatDate = useCallback((instantString: string, showTime: boolean) => {
    const timestamp = Number(instantString) * 1000
    const date = new Date(timestamp)

    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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