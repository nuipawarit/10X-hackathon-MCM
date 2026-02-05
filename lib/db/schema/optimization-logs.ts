import { pgTable, uuid, varchar, text, decimal, boolean, timestamp } from 'drizzle-orm/pg-core';
import { campaigns } from './campaigns';

export const optimizationLogs = pgTable('optimization_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaignId: uuid('campaign_id').references(() => campaigns.id).notNull(),
  recommendationId: uuid('recommendation_id'),
  action: text('action').notNull(),
  platform: varchar('platform', { length: 50 }),
  previousBudget: decimal('previous_budget', { precision: 12, scale: 2 }),
  newBudget: decimal('new_budget', { precision: 12, scale: 2 }),
  reasoning: text('reasoning'),
  applied: boolean('applied').default(false).notNull(),
  appliedAt: timestamp('applied_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
