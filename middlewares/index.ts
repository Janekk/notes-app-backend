import express from "express"
import jwt from "jsonwebtoken"
import {getPublicUser} from "../services/userService"
import {Request} from "../utils"

export function authenticateAccessToken(req: Request, res: express.Response, next: any) {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(" ")[1]

    jwt.verify(token, process.env.TOKEN_SECRET as string, async (err: any, tokenUser: any) => {
      if (err) {
        console.log(err)
        return res.status(401).json({error: "Unauthorized"})
      }

      const user = await getPublicUser(tokenUser.email)
      if (!user) {
        return res.status(401).json({error: "Unauthorized"})
      }

      req.user = user
      next()
    })
  } else {
    res.status(401).json({error: "Unauthorized"})
  }
}
