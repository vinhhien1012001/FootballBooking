const wrapedSendMail = require("../configs/mail");
const env = require("../configs/envConfigs");

const sendMail = async (subject, text) => {
    var mailOptions = {
        from: env.mailUserName,
        to: env.mailFormAddress,
        subject: subject,
        text: text
    };
    let resp = await wrapedSendMail(mailOptions);
    console.log(resp)
    // log or process resp;
    return resp;
};

module.exports = sendMail;