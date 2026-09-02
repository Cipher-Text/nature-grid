/**
 * Loaded by Jest (setupFiles) in every worker process before any test module
 * is imported. Sets process.env from .env.test so the NestJS app can boot.
 *
 * dotenv.config() does NOT override env vars that are already set, so CI
 * values (set in the workflow) take precedence when .env.test is absent.
 */
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.test') });
