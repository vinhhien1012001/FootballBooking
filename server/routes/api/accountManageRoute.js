const route = require("express").Router();
const accountAPI = require("../../api/account/accountManage");
route.post("/forgetpass/:id", accountAPI.postForgetPassword);
route.post("/changeaccount/:id", accountAPI.postChangeProfile);

module.exports =route;