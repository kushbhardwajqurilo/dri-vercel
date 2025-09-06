const jsonToken = require('jsonwebtoken'); 
exports.UserAuthMiddleWare = async(req, res, next)=>{
    try{
        const authToken = req.headers['authorization'].split(' ')[1]
        const userInfo = jsonToken.verify(authToken,process.env.SecretKey);
        if(userInfo){
            req.user_id = userInfo.userId,
            req.role = userInfo.role
            next();
        }else{
            res.json({ 
                status:"failed",
                message:"Authorization  failed"
            })
        }
    }catch(err){
        res.json({
            status:"failed",
            message:"Authentication failed",
            error:err
        })
    }
}