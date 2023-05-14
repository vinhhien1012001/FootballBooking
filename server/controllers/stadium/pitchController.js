const Pitch = require("../../models/Pitch");
const Stadium = require("../../models/Stadium");

function getListPitch(req, res) {
  res.render("pitch/listPitch");
}

async function getAddPitch(req, res) {
  const stadium = await Stadium.find({}, { _id: 1, name: 1 }).lean();
  console.log(stadium);

  res.render("pitch/addPitch", {
    stadium: stadium,
  });
}

async function postAddPitch(req, res) {
  console.log(req.body);

  const pitch = new Pitch({
    name: req.body.name,
    category: req.body.category,
    stadium_id: req.body.stadium,
  });

  try {
    const stadium = await Stadium.findById(req.body.stadium);
    stadium.list_id_pitch.push(pitch._id);

    await stadium.save();
    await pitch.save();
    res.redirect("/pitch");
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getListPitch,
  getAddPitch,
  postAddPitch,
};
