const { addHours, differenceInHours, format } = require("date-fns");
//TODO
function splitTime(startTime, endTime) {
  const intervalHours = 1;
  const result = [];

  // Điều chỉnh thời gian bắt đầu và kết thúc
  // startTime = startOfHour(startTime);
  // endTime = endOfHour(endTime);

  let currentStartTime = startTime;
  let currentEndTime = addHours(currentStartTime, intervalHours);

  while (currentStartTime < endTime && currentEndTime <= endTime) {
    result.push({
      start: format(currentStartTime, "HH:mm"),
      end: format(currentEndTime, "HH:mm"),
    });
    currentStartTime = currentEndTime;
    currentEndTime = addHours(currentStartTime, intervalHours);
  }

  return result;
}

module.exports = {
  splitTime,
};
