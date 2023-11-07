import { useCallback } from 'react'; // Custom hook for formatting timestamps

// Custom hook for formatting timestamps
const useFormatTimestamp = () => {
  const formatTimestamp = useCallback((seconds: number): string => {
    const pad = (num: number, size: number): string =>
      ('000' + num).slice(size * -1);
    let time = seconds; // No need to parseFloat, assuming seconds is always a number
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let secs = Math.floor(time % 60);

    let formattedTime = `${pad(minutes, 2)}:${pad(secs, 2)}`;
    if (hours > 0) {
      formattedTime = `${pad(hours, 2)}:${formattedTime}`;
    }

    return formattedTime;
  }, []);

  return formatTimestamp;
};

export default useFormatTimestamp;
