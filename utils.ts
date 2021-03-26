import {User} from "@prisma/client"
import express from "express"
import {CustomError} from "ts-custom-error"

export interface Request extends express.Request {
  user?: PublicUser | null
}

export interface RequestWithUser extends express.Request {
  user: PublicUser
}

export type PublicUser = Omit<User, "password">

export enum NotePermissionTypes {
  View = "view",
  Edit = "edit",
}

class ValidationError extends CustomError {
  status: number

  constructor(message?: string, status: number = 400) {
    super(message)
    this.status = status
  }
}

export {ValidationError}

export function getCurrentTime() {
  return new Date().getTime()
}
