const jwt = require("jsonwebtoken");
const Users = require("../models/users.model.js")

const auth = async (req, res, next) =>
{
  try
  {
    console.log(123)
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.verify(token, process.env.JWT_SECRECT)
    console.log(decoded)
    const user = await Users.findOne({ _id: decoded._id, 'tokens.token': token })
 
    if (!user)
    {
      throw new Error()
    }
    req.token = token
    req.user = user 
    next()
  } catch (error) {
    res.status(401).send({"error": "Please authenticate!"})
  }

}



module.exports = auth