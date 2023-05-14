
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
/* LOGGING IN */
const loginAPI = {
  login: async (req, res) => {
    
    try {
      console.log("hello");
      const { email, password } = req.body;
      let user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
      
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (!isMatch)
        return res.status(400).json({ msg: "Invalid credentials." });

      if (isMatch) {
        const token = jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET
        );
        user.password = undefined;
        
        return res
          .status(200)
          .json({ token, user});
      } else {
        return res.status(500).json({ status: "error", user: false });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = loginAPI;