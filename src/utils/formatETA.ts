export const formatETA = (minutes: number): string => {
  if (minutes < 1) {
    return 'Arriving now';
  }
  
  if (minutes < 60) {
    return `${Math.round(minutes)} min${minutes > 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  
  const kilometers = meters / 1000;
  return `${kilometers.toFixed(1)}km`;
};

export const getETAColor = (minutes: number): string => {
  if (minutes <= 2) return 'text-green-600';
  if (minutes <= 5) return 'text-yellow-600';
  if (minutes <= 10) return 'text-orange-600';
  return 'text-red-600';
};