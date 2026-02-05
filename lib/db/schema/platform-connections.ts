import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const connectionStatusEnum = pgEnum('connection_status', ['active', 'expired', 'not_connected']);

export const platformConnections = pgTable('platform_connections', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  platform: varchar('platform', { length: 50 }).notNull(),
  accountId: varchar('account_id', { length: 255 }),
  accessToken: text('access_token'),
  status: connectionStatusEnum('status').default('not_connected').notNull(),
  lastSyncAt: timestamp('last_sync_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
