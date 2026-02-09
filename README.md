# NestJS Music API
Backend application build with NestJS, PostgreSQL, Prisma and MinIO.

## Development
Run the application with hot reload:
```bash
docker compose \
  -f docker-compose.yaml \
  -f docker-compose.dev.yaml \
  up --build -d
```
Available services (dev):
- API: http://localhost:3000
- PgAdmin: http://localhost:8080
- MinIO: http://localhost:9001

## Production
Run production setup:
```bash
docker compose up -d --build
```

## Prisma
Prisma Client is generated automatically during Docker build.
### Migrations
Run migrations manually:
```bash
docker compose exec app npx prisma migrate deploy
```