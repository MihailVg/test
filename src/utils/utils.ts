export const parseDate = (dateStr?: string): Date | undefined => {
	if (!dateStr) return undefined
	const date = new Date(dateStr)
	return isNaN(date.getTime()) ? undefined : date
}
