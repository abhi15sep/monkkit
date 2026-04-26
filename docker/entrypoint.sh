#!/bin/sh
set -e

echo "[monkkit] Running database schema sync..."
node_modules/.bin/prisma db push --accept-data-loss

echo "[monkkit] Seeding permissions for existing API keys..."
node docker/migrate-seed.mjs

echo "[monkkit] Starting server..."
exec node server.js
