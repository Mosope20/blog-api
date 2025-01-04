import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.cookie;
    const token = authHeader.split('=')[1];

    if (!token) return res.status(401).send('Unauthorized');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send('Forbidden');
        req.user = user;//setting user data
        console.log(req.user);
        next();
    });
};


