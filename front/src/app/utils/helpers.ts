export const formatDuration = (totalSeconds: number | undefined | null) => {
  if (totalSeconds === null || typeof totalSeconds !== "number" || isNaN(totalSeconds)) {
    return "N/A";
  }
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (parts.length === 0 || seconds > 0) parts.push(`${seconds}s`);
  
  return parts.join(" ");
};