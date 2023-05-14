const momentTimeZone = require("moment-timezone");
const moment = require("moment");

function stringToDate(strTime, type) {
  // console.log(momentTimeZone.tz(strTime, type).toDate());
  return moment(strTime, type).toDate();
}

function mergeDateTime(date, time) {
  const [hours, minutes] = time.split(":");
  const newDate = new Date(date);
  newDate.setUTCHours(hours); // đặt giờ theo múi giờ UTC
  newDate.setUTCMinutes(minutes); // đặt phút theo múi giờ UTC
  return newDate;
}

module.exports = {
  stringToDate,
  mergeDateTime,
};
