const authAPI = require("express").Router();
const registerAPI = require("../../api/auth/register");
const loginAPI = require("../../api/auth/login");

authAPI.post("/login", loginAPI.login);
authAPI.post("/register", registerAPI.register, loginAPI.login);

module.exports = authAPI;
