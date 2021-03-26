# notes-app-backend

## Local setup

```
npm install
# init dev sqlite db
sqlite3 dev.db "VACUUM;"
# run db migrations
npx prisma migrate dev
# run in dev mode
npm run dev
```
