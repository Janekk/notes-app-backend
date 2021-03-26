import express from "express"
import {authenticateAccessToken} from "../middlewares"

const router = express.Router()

// route: users
router.get("/me", authenticateAccessToken, async (req: any, res) => {
  res.json(req.user)
})

export default router
