import {Note, Prisma, PrismaClient, UserNote} from "@prisma/client"
import {NotePermissionTypes, PublicUser} from "../utils"

const prisma = new PrismaClient()

const userNoteResponseFormat: Prisma.UserNoteSelect = {
  note: true,
  permissionType: true,
  validUntil: true,
}

export async function getUserNotes(user: PublicUser) {
  return await prisma.userNote.findMany({
    where: {
      userId: user.id,
      OR: [
        {
          validUntil: null,
        },
        {
          validUntil: {
            gt: new Date(),
          },
        },
      ],
    },
    select: userNoteResponseFormat,
  })
}

export async function getUserNote(
  user: PublicUser,
  noteId: string,
  validOnly: boolean = true,
): Promise<UserNote | null> {
  const userNote: any = await prisma.userNote.findUnique({
    where: {
      noteId_userId: {
        noteId,
        userId: Number(user.id),
      },
    },
    select: userNoteResponseFormat,
  })
  if (!userNote) {
    return null
  }

  if (validOnly) {
    if (userNote?.validUntil && userNote.validUntil < new Date()) {
      return null
    }
  }
  return userNote
}

export async function getNote(id: string): Promise<Note | null> {
  return prisma.note.findUnique({
    where: {
      id,
    },
  })
}

export async function updateNote(user: PublicUser, id: string, title: string, content: string): Promise<UserNote | null> {

  console.log('updateNote', id, title, content)

  return prisma.userNote.update({
    where: {
      noteId_userId: {
        noteId: id,
        userId: user.id,
      },
    },
    data: {
      note: {
        update: {
          title,
          content
        }
      }
    },
  })
}

export async function createUserNote(user: PublicUser, title: string, content: string) {
  return await prisma.userNote.create({
    data: {
      note: {
        create: {
          title,
          content,
        },
      },
      user: {
        connect: {id: user.id},
      },
      validUntil: null,
      permissionType: NotePermissionTypes.Edit,
    },
    select: userNoteResponseFormat,
  })
}

export async function shareNote(
  noteId: string,
  userId: number,
  validUntil: Date | undefined | null,
  permissionType: NotePermissionTypes,
) {
  return prisma.userNote.upsert({
    where: {
      noteId_userId: {
        noteId: noteId,
        userId: Number(userId),
      },
    },
    update: {
      validUntil,
      permissionType,
    },
    create: {
      note: {
        connect: {id: noteId},
      },
      user: {
        connect: {id: Number(userId)},
      },
      validUntil,
      permissionType,
    },
    select: userNoteResponseFormat,
  })
}
