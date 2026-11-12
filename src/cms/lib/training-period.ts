/** Both dates are optional so existing cases and partially entered periods stay valid. */
export function validateTrainingPeriod(
  start?: string | null,
  end?: string | null,
) {
  const startTime = start ? Date.parse(start) : null;
  const endTime = end ? Date.parse(end) : null;
  if (
    (startTime !== null && Number.isNaN(startTime)) ||
    (endTime !== null && Number.isNaN(endTime))
  )
    return "invalid-date";
  if (startTime !== null && endTime !== null && endTime < startTime)
    return "end-before-start";
  return null;
}

/** Update requests may contain just one date; explicit null clears that date. */
export function mergeTrainingPeriod(
  data: { trainingStartDate?: string | null; trainingEndDate?: string | null },
  previous?: {
    trainingStartDate?: string | null;
    trainingEndDate?: string | null;
  },
) {
  return {
    start:
      data.trainingStartDate === undefined
        ? previous?.trainingStartDate
        : data.trainingStartDate,
    end:
      data.trainingEndDate === undefined
        ? previous?.trainingEndDate
        : data.trainingEndDate,
  };
}
