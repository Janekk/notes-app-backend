import express, { NextFunction } from "express"
import { authenticateAccessToken } from "../middlewares"
import { NotePermissionTypes, Request, RequestWithUser } from "../utils"
import { body, validationResult } from "express-validator"
import { createUserNote, getUserNotes, getUserNote, getNote, shareNote, updateNote } from "../services/noteService"
import { getUser } from "../services/userService"

const router = express.Router()

// get notes for authenticated user
router.get("/", authenticateAccessToken, async (req: Request, res, next: NextFunction) => {
  const withUser = <RequestWithUser>req
  try {
    const userNotes = await getUserNotes(withUser.user)
    return res.json(userNotes)
  } catch (e) {
    next(e)
  }
})

// get single note
router.get("/:id", authenticateAccessToken, async (req: Request, res, next: NextFunction) => {
  const withUser = <RequestWithUser>req
  const userNote = await getUserNote(withUser.user, req.params.id)

  if (userNote) {
    return res.json(userNote)
  }
  try {
    const note = await getNote(req.params.id)
    if (note) {
      return res.sendStatus(403)
    }
    return res.sendStatus(404)
  } catch (e) {
    next(e)
  }
})

// create note
router.post("/", authenticateAccessToken, async (req: Request, res, next: NextFunction) => {
  const { title, content } = req.body
  const withUser = <RequestWithUser>req
  try {
    const userNote = await createUserNote(withUser.user, title, content)
    return res.json(userNote)
  } catch (e) {
    next(e)
  }
})

// edit note
router.patch("/:id", authenticateAccessToken, async (req: Request, res, next: NextFunction) => {
  const { title, content } = req.body
  const withUser = <RequestWithUser>req
  try {
    const userNote = await updateNote(req.params.id, title, content)
    return res.json(userNote)
  } catch (e) {
    next(e)
  }
})

router.post("/:id/share", authenticateAccessToken, body("email").isEmail(), async (req: Request, res, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const withUser = <RequestWithUser>req
    const myShare = await getUserNote(withUser.user, req.params.id)

    if (!myShare) {
      return res.status(400).json({ error: "Could not share this note" })
    }

    if (myShare.permissionType != NotePermissionTypes.Edit) {
      return res.status(400).json({ error: "Only editors can share not with other users" })
    }

    const recipient = await getUser(req.body.email)
    if (!recipient) {
      return res.status(400).json({ error: "Could not share this note" })
    }

    const share = await shareNote(
      req.params.id,
      Number(recipient?.id),
      new Date(req.body.validUntil),
      NotePermissionTypes.View,
    )
    return res.json(share)
  } catch (e) {
    next(e)
  }
})

export default router
