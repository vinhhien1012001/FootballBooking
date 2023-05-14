const Pitch = require("../../models/Pitch");
const Stadium = require("../../models/Stadium");
const Price = require("../../models/Price");
const TimeBooking = require("../../models/TimeBooking");
const timeUtils = require("../../utils/momentTimezone");
const timeBooking = require("../../utils/timeBooking");

// check timeSlot
// note should not change directly on the object being used or reused because it can return the memory cell of this time, so the next time it is used again, it will take the memory cell of that object out for use.
async function updateTimeSlots(pitchId, timeSlots, date) {
  // get timebooking witch condition time > date and time < date + 1 day (end day)
  const times = await TimeBooking.aggregate([
    {
      $match: {
        pitch_id: pitchId,
        time: {
          $gte: date,
          $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    },
  ]);

  // check timeslot, compare timeslot with timebooking
  // if correct then true
  // if wrong then false
  const updatedTimeslots = [];
  for (let timeSlot of timeSlots) {
    let check = false;
    for (const time of times) {
      if (
        timeUtils.mergeDateTime(date, timeSlot.start).getTime() ===
        time.time.getTime()
      ) {
        check = true;
      }
    }
    updatedTimeslots.push({ ...timeSlot, check: check });
  }
  //
  // for (let timeSlot of timeSlots) {
  //   await TimeBooking.findOne({
  //     time: timeUtils.mergeDateTime(date, timeSlot.start),
  //     pitch_id: pitchId,
  //   }).then((check) => {
  //     if (check) {
  //       // console.log(pitchId, check);
  //       updatedTimeslots.push({ ...timeSlot, check: true });
  //     } else {
  //       // console.log(pitchId, check);
  //       updatedTimeslots.push({ ...timeSlot, check: false });
  //     }
  //     //console.log(updatedTimeslots);
  //   });
  // }
  // console.log(updatedTimeslots);
  //
  return updatedTimeslots;
}

// async function addTimeBooking() {
//   const newTimeBooking = new TimeBooking({
//     time: new Date("2023-04-14T06:30:00.000Z"),
//     pitch_id: "6437788f7fa3d436c5abd3ac", // ID của sân đang đặt
//   });
//
//   try {
//     const result = await newTimeBooking.save();
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// }

//GET [staidum/:id/:category]
async function getCategory(req, res) {
  const stadiumId = req.params.id_stadium;
  const category = req.params.category;
  const date = new Date(req.query.date);
  console.log(date);
  /* console.log(req.query.date); */
  date.setUTCHours(0, 0, 0, 0);

  try {
    let pitches = await Pitch.find(
      {
        stadium_id: stadiumId,
        category: category,
      },
      {
        create_at: 0,
        update_at: 0,
        is_delete: 0,
      }
    );

    //get price and time booking
    const priceDaytime = await Price.findOne(
      { id_stadium: stadiumId, is_daytime: true },
      {
        create_at: 0,
        update_at: 0,
        is_delete: 0,
        __v: 0,
      }
    );
    let priceD = priceDaytime.price;

    const priceNighttime = await Price.findOne(
      {
        id_stadium: stadiumId,
        is_daytime: false,
      },
      {
        create_at: 0,
        update_at: 0,
        is_delete: 0,
        __v: 0,
      }
    );
    let priceN = priceNighttime.price;

    if (category == "San7") {
      priceD = priceD + priceD * 0.1;
      priceN = priceN + priceN * 0.1;
    }
    // setup timeSlot
    const timeSlots = timeBooking
      .splitTime(priceDaytime.start_time, priceDaytime.end_time)
      .concat(
        timeBooking.splitTime(
          priceNighttime.start_time,
          priceNighttime.end_time
        )
      );

    // process Pitch when timeslot iclude timebooking and add that into updatedPitches
    async function processPitches(pitches, timeSlots, date) {
      const updatedPitches = [];
      let time;
      for (let pitch of pitches) {
        time = await updateTimeSlots(pitch._id, timeSlots, date);
        const updatedPitch = {
          pitch,
          time: [...time],
          priceDaytime: priceD,
          priceNighttime: priceN,
        };

        updatedPitches.push(updatedPitch);
      }
      return updatedPitches;
    }

    // await all promit from function processPitch
    const updatedPitches = await processPitches(pitches, timeSlots, date);

    console.log(updatedPitches[0]);
    return res.status(200).json(updatedPitches);
  } catch (err) {
    console.log(err);
    res.status(404);
  }
}

module.exports = {
  getCategory,
};
