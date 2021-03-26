-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserNote" (
    "noteId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "permissionType" TEXT NOT NULL,
    "validUntil" DATETIME,

    PRIMARY KEY ("noteId", "userId"),
    FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserNote" ("noteId", "userId", "created", "permissionType", "validUntil") SELECT "noteId", "userId", "created", "permissionType", "validUntil" FROM "UserNote";
DROP TABLE "UserNote";
ALTER TABLE "new_UserNote" RENAME TO "UserNote";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
