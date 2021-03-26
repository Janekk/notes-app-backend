import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {registerUser, getUser} from "../services/userService"
import {body, validationResult} from "express-validator"

const router = express.Router()

function generateAccessToken(payload: any) {
  return jwt.sign(payload, process.env.TOKEN_SECRET as string, {
    expiresIn: `${60 * 60 * 24}s`,
  })
}

router.post("/register", body("email").isEmail(), async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  const {email, name, password} = req.body
  var hashedPassword: string = bcrypt.hashSync(password, 8)

  try {
    await registerUser(name, email, hashedPassword)
  } catch (e) {
    next(e)
  }

  return res.json({result: "success"})
})

router.post("/login", async (req, res) => {
  const {email, password} = req.body
  const user = await getUser(email)
  if (!user) return res.status(401).json({error: "User does not exist."})

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(401).json({error: "User does not exist."})

  const token = generateAccessToken({email: user.email})
  return res.json({token})
})

export default router
