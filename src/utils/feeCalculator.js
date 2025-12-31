export const calculateParkingFee = (entryTime, exitTime, feePer24Hours) => {
  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  const diffMs = exit - entry;
  const diffHours = diffMs / (1000 * 60 * 60);
  const days = Math.ceil(diffHours / 24);
  return days * feePer24Hours;
};

export const calculateTotalFee = (
  entryTime,
  exitTime,
  feePer24Hours,
  isLostToken = false,
  lostTokenPenalty = 0
) => {
  const parkingFee = calculateParkingFee(entryTime, exitTime, feePer24Hours);
  return isLostToken ? parkingFee + lostTokenPenalty : parkingFee;
};
