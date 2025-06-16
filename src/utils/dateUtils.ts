export const formatDate = (dateString: string | Date) => {
  const date = typeof dateString === 'string' 
    ? new Date(dateString) 
    : dateString;
  
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};