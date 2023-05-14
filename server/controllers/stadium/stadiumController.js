const Stadium = require("../../models/Stadium");
const Price = require("../../models/Price");
const Pitch = require("../../models/Pitch");
const uploadImg = require("../../middleware/uploadImage");
const momentTimeZone = require("../../utils/momentTimezone");

async function getListStadium(req, res) {
  const results = {};
  let page = Math.max(parseInt(req.query.page) || 1, 1);
  if (req.query.page == null) {
    page = 1;
  }

  const size = await Stadium.count({ is_delete: false });
  const limit = 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const stadiums = await Stadium.find(
    { is_delete: false },

    {
      list_id_pitch: 0,
      create_at: 0,
      update_at: 0,
      is_delete: 0,
      __v: 0,
    }
  )
    .sort({ create_at: -1 })
    .skip(startIndex)
    .limit(limit);

  if (endIndex < size) {
    results.next = page + 1;
  }

  if (startIndex > 0) {
    results.previous = page - 1;
  }
  results.currentPage = page;

  let nextPage = "/stadium" + "?page=" + results.next;
  let currentPage = "/stadium" + "?page=" + results.currentPage;
  let prevousPage = "/stadium" + "?page=" + results.previous;

  let all_of_stadiums = stadiums;
  let temp = [];
  for (let stadium of all_of_stadiums) {
    const object = {};
    object._id = String(stadium._id);
    object.name = stadium.name;
    object.address = stadium.address;
    object.status = stadium.status;
    object.details = stadium.details;
    object.img = stadium.image;
    temp.push(object);
  }

  res.render("stadium/listStadium", {
    stadiums: temp,
    nextLink: nextPage,
    currentLink: currentPage,
    previousLink: prevousPage,
    next: results.next,
    currentPage: results.currentPage,
    previous: results.previous,
  });
}

function getAddStadium(req, res) {
  res.render("stadium/addStadium");
}

async function postAddStadium(req, res) {
  const listImg = [];
  let image = "";

  const files = await uploadImg.uploadFile(req, res);
  if (files.length > 0) {
    let i = 1;
    for (let file of files) {
      if (i == 1) image = file.filename;
      else listImg.push(file.filename);
      i = i + i;
    }
  }

  const stadium = new Stadium({
    name: req.body.name,
    address: req.body.address,
    details: req.body.detail,
    list_image: listImg,
    image: image,
  });

  const price_daytime = new Price({
    is_daytime: true,
    start_time: momentTimeZone.stringToDate(req.body.start_daytime, "HH:mm"),
    end_time: momentTimeZone.stringToDate(req.body.end_daytime, "HH:mm"),
    price: req.body.price_daytime,
    id_stadium: stadium._id,
  });

  const price_nighttime = new Price({
    is_daytime: false,
    start_time: momentTimeZone.stringToDate(req.body.start_nighttime, "HH:mm"),
    end_time: momentTimeZone.stringToDate(req.body.end_nighttime, "HH:mm"),
    price: req.body.price_nighttime,
    id_stadium: stadium._id,
  });

  try {
    await stadium.save();
    await price_daytime.save();
    await price_nighttime.save();
    res.redirect("/pitch");
  } catch (err) {
    console.log(err);
  }
}

async function getEditStadium(req, res) {
  const stadiumId = req.params.id;
  const stadium = await Stadium.findById(stadiumId, {
    list_id_pitch: 0,
    create_at: 0,
    update_at: 0,
    is_delete: 0,
    __v: 0,
  });

  const price_daytime = await Price.findOne(
    {
      id_stadium: stadiumId,
      is_daytime: true,
    },
    {
      create_at: 0,
      update_at: 0,
      is_delete: 0,
      __v: 0,
    }
  );
  const price_nighttime = await Price.findOne(
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

  let stadiumObject = {};
  stadiumObject._id = String(stadium._id);
  stadiumObject.name = stadium.name;
  stadiumObject.address = stadium.address;
  stadiumObject.status = stadium.status;
  stadiumObject.details = stadium.details;
  stadiumObject.img = stadium.image;

  res.render("stadium/editStadium", {
    stadium: stadiumObject,
    startDaytime:
      price_daytime.start_time.getHours().toString().padStart(2, "0") +
      ":" +
      price_daytime.start_time.getMinutes().toString().padStart(2, "0"),
    endDaytime:
      price_daytime.end_time.getHours().toString().padStart(2, "0") +
      ":" +
      price_daytime.end_time.getMinutes().toString().padStart(2, "0"),
    startNighttime:
      price_nighttime.start_time.getHours().toString().padStart(2, "0") +
      ":" +
      price_nighttime.start_time.getMinutes().toString().padStart(2, "0"),

    endNighttime:
      price_nighttime.end_time.getHours().toString().padStart(2, "0") +
      ":" +
      price_nighttime.end_time.getMinutes().toString().padStart(2, "0"),
    priceDay: price_daytime.price,
    priceNight: price_nighttime.price,
  });
}

async function postEditStadium(req, res) {
  const stadiumId = req.params.id;
  const dataUpdate = req.body;
  console.log(dataUpdate);
  try {
    await Stadium.findOneAndUpdate(
      { _id: stadiumId },
      {
        name: dataUpdate.name,
        address: dataUpdate.address,
        details: dataUpdate.details,
        status: dataUpdate.status,
        update_at: {
          update_time: Date.now(),
          update_content: "Update",
        },
      }
    );

    await Price.findOneAndUpdate(
      { id_stadium: stadiumId, is_daytime: true },
      {
        start_time: momentTimeZone.stringToDate(
          req.body.start_daytime,
          "HH:mm"
        ),
        end_time: momentTimeZone.stringToDate(req.body.end_daytime, "HH:mm"),
        price: req.body.price_daytime,
        update_at: {
          update_time: Date.now(),
          update_content: "Update",
        },
      }
    );

    await Price.findOneAndUpdate(
      { id_stadium: stadiumId, is_daytime: false },
      {
        start_time: momentTimeZone.stringToDate(
          req.body.start_nighttime,
          "HH:mm"
        ),
        end_time: momentTimeZone.stringToDate(req.body.end_nighttime, "HH:mm"),
        price: req.body.price_nighttime,

        update_at: {
          update_time: Date.now(),
          update_content: "Update",
        },
      }
    );

    res.redirect("/stadium");
  } catch (e) {
    console.log(e);
    res.redirect("/stadium");
  }
}

async function getDeleteStadium(req, res) {
  const stadiumId = req.params.id;

  try {
    const stadium = await Stadium.findOneAndUpdate(
      { _id: stadiumId },
      {
        status: "Close",
        update_at: {
          update_time: Date.now(),
          update_content: "Delete",
        },
        is_delete: true,
      }
    );
    for (let i = 0; i < stadium.list_id_pitch.length; i++) {
      console.log(stadium.list_id_pitch[0]);
      await Pitch.findOneAndUpdate(
        { _id: stadium.list_id_pitch[i] },
        {
          update_at: {
            update_time: Date.now(),
            update_content: "Delete",
          },
          is_delete: true,
        }
      );
    }

    res.redirect("/stadium");
  } catch (e) {
    console.log(e);
    res.redirect("/stadium");
  }
}

module.exports = {
  getListStadium,
  getAddStadium,
  getEditStadium,
  getDeleteStadium,

  postAddStadium,
  postEditStadium,
};
