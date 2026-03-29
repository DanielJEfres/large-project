import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config()

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'] //is string in form "Bearer Token"
    
    // Split authHeader by space and take only "Token"
    
    // exists && matches expected form)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendStatus(401);
    } 

    const token = authHeader.split(" ")[1] // extract "Token" component
    
    // Check if header is malformed
    if (token == null) return res.sendStatus(401); // No Access code
    
    //validate token:
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) return res.sendStatus(403)

        req.user = payload //since valid, recover entire payload
        next()
    })
}

export default authenticateToken;