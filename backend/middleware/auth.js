import jwt from 'jsonwebtoken'

const auth = async (req,res,next)=>{
    const token = req.header("Authorization")?.split(" ")[1];
    if(!token){
        return res.status(401).send("Access Denied")
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next();
    } catch (error) {
        res.status(400).send("Invalid token")
    }
}

export default auth;