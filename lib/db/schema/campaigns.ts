import { pgTable, uuid, varchar, decimal, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const campaignObjectiveEnum = pgEnum('campaign_objective', ['awareness', 'consideration', 'conversion']);
export const campaignStatusEnum = pgEnum('campaign_status', ['draft', 'active', 'paused', 'completed']);

export const campaigns = pgTable('campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  objective: campaignObjectiveEnum('objective').notNull(),
  status: campaignStatusEnum('status').default('draft').notNull(),
  budget: decimal('budget', { precision: 12, scale: 2 }).notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
