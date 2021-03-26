import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import createError from "http-errors"
import {authController, userController, noteController} from "./controllers"

dotenv.config()

if (!process.env.PORT) {
  process.exit(1)
}

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/auth", authController)
app.use("/users", userController)
app.use("/notes", noteController)

app.use((req, res, next) => {
  next(createError(404))
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!err) {
    return next()
  }
  console.error("ERROR", err)
  res.status(err.status || 500)
  res.send({message: err.message})
  return res
})

const PORT = parseInt(process.env.PORT, 10)
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
