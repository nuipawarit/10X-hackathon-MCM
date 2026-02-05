import { pgTable, uuid, varchar, decimal, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { campaigns } from './campaigns';
import { creatives } from './creatives';

export const deploymentStatusEnum = pgEnum('deployment_status', ['pending', 'deploying', 'active', 'paused', 'completed']);

export const deployments = pgTable('deployments', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaignId: uuid('campaign_id').references(() => campaigns.id).notNull(),
  creativeId: uuid('creative_id').references(() => creatives.id),
  platform: varchar('platform', { length: 50 }).notNull(),
  budget: decimal('budget', { precision: 12, scale: 2 }).notNull(),
  status: deploymentStatusEnum('status').default('pending').notNull(),
  estimatedReach: varchar('estimated_reach', { length: 50 }),
  externalId: varchar('external_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
