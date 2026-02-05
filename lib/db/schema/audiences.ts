import { pgTable, uuid, varchar, text, integer, decimal, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';
import { campaigns } from './campaigns';

export const audiences = pgTable('audiences', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaignId: uuid('campaign_id').references(() => campaigns.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  tagline: text('tagline'),
  intentScore: integer('intent_score').notNull(),
  demographics: jsonb('demographics'),
  psychographics: jsonb('psychographics'),
  behaviors: jsonb('behaviors'),
  recommendedMessaging: text('recommended_messaging'),
  tags: jsonb('tags'),
  aiGenerated: boolean('ai_generated').default(true).notNull(),
  lifecycleStage: varchar('lifecycle_stage', { length: 50 }),
  segmentType: varchar('segment_type', { length: 50 }).default('consumer'),
  customerCount: integer('customer_count'),
  avgOrderValue: decimal('avg_order_value', { precision: 10, scale: 2 }),
  purchaseFrequency: decimal('purchase_frequency', { precision: 4, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
