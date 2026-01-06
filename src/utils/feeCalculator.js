export const calculateParkingFee = (entryTime, exitTime, feePer24Hours, extraHourRate) => {
  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  const diffMs = exit - entry;
  const totalHours = diffMs / (1000 * 60 * 60);
  if (totalHours <= 24) {
    return feePer24Hours;
  } else {
    const extraHours = Math.ceil(totalHours - 24);
    return feePer24Hours + extraHours * extraHourRate;
  }
};

export const calculateTotalFee = (
  entryTime,
  exitTime,
  feePer24Hours,
  extraHourRate,
  isLostToken = false,
  lostTokenPenalty = 0
) => {
  const parkingFee = calculateParkingFee(entryTime, exitTime, feePer24Hours, extraHourRate);
  return isLostToken ? parkingFee + lostTokenPenalty : parkingFee;
};

export const getFeeBreakdown = (entryTime, exitTime, feePer24Hours, extraHourRate) => {
  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  const diffMs = exit - entry;
  const totalHours = diffMs / (1000 * 60 * 60);
  const totalMinutes = diffMs / (1000 * 60);
  const hours = Math.floor(totalHours);
  const minutes = Math.floor(totalMinutes % 60);
  const duration = `${hours}:${minutes.toString().padStart(2, '0')}`;
  let baseFee = feePer24Hours;
  let extraHours = 0;
  let extraCharges = 0;
  if (totalHours > 24) {
    extraHours = Math.ceil(totalHours - 24);
    extraCharges = extraHours * extraHourRate;
  }
  const finalAmount = baseFee + extraCharges;
  return {
    entryTime: entry.toLocaleString(),
    exitTime: exit.toLocaleString(),
    totalDuration: duration,
    baseFee,
    extraHours,
    extraCharges,
    finalAmount: Math.round(finalAmount),
  };
};
