#!/bin/sh
set -e

echo "Running database migrations…"
# Schema path is absolute so this works regardless of WORKDIR
prisma migrate deploy --schema=/repo/packages/database/prisma/schema.prisma

echo "Starting API…"
exec "$@"
