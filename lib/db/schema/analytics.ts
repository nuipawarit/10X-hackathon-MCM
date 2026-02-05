import { pgTable, uuid, varchar, integer, decimal, date, timestamp } from 'drizzle-orm/pg-core';
import { campaigns } from './campaigns';
import { deployments } from './deployments';

export const analytics = pgTable('analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaignId: uuid('campaign_id').references(() => campaigns.id).notNull(),
  deploymentId: uuid('deployment_id').references(() => deployments.id),
  platform: varchar('platform', { length: 50 }),
  impressions: integer('impressions').default(0).notNull(),
  clicks: integer('clicks').default(0).notNull(),
  conversions: integer('conversions').default(0).notNull(),
  spend: decimal('spend', { precision: 12, scale: 2 }).default('0').notNull(),
  revenue: decimal('revenue', { precision: 12, scale: 2 }).default('0').notNull(),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
