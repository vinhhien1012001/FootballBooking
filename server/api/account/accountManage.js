const User = require("../../models/User");
const bcrypt = require("bcrypt");
const accountManage = {
    postForgetPassword: async(req,res)=>{
        const user_id = req.params["id"];
        const old_password = req.body.old_password;
        const new_password = req.body.new_password;

        const user = await User.findOne({
            _id:user_id
        })
        if (await bcrypt.compare(old_password,user.password)){
            if (new_password == old_password){
                return res.json({
                    message: "password must not similar"
                })
            }
        }
        else{
            return res.json({
                message: "passwords don't match"
            })
        }

        if (!user){
            return res.json({
                message:"User doesn't exist"
            })
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(new_password, salt);
            console.log(hashPassword);
            await User.updateOne({
                _id: user_id
            },{
                password:hashPassword
            })
            res.json({
                message:"successfully"
            })
        }
    }
    ,

    postChangeProfile:async (req,res)=>{
        const user_id = req.params["id"];
        let user_name = req.body.user_name;
        let user_phone = req.body.phone;

        const user = await User.findOne({
            _id:user_id
        })
      
        if (user_name === user.user_name || user_phone === user.phone){
            return res.json({
                message:"username or phone must not similar"
            })
        }
    
        if (isNaN(Number(user_phone)) && user_phone != null){
            return res.json({
                message:"phone number must be 0-9"
            })
        }

        if (!user){
            return res.json({
                message:"User doesn't exist"
            })
        }
        else{
            console.log(user.phone,user.user_name)
            
            if (user_name == null||user_name == ""){
                user_name = user.user_name;
            }
            if (user_phone == "" || user_phone == null){
                user_phone = user.phone
            }
            console.log(user_phone,user_name)
            const updateObject = {
                update_time: Date.now(),
                update_content:"change username or phone"
            }
            User.updateOne({
                _id:user_id
            },{
                phone: user_phone,
                user_name: user_name,
                update_at: updateObject
            }).then(data=>{
                console.log("update success")
            })

            return res.json({
                message:"successfully",
            })
        }
       
    }

}

module.exports = accountManage;