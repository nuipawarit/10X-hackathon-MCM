import { pgTable, uuid, varchar, text, decimal, jsonb, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { campaigns } from './campaigns';
import { audiences } from './audiences';

export const creativeTypeEnum = pgEnum('creative_type', ['image', 'video', 'copy']);
export const creativeStatusEnum = pgEnum('creative_status', ['generating', 'completed', 'failed']);

export const creatives = pgTable('creatives', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaignId: uuid('campaign_id').references(() => campaigns.id).notNull(),
  personaId: uuid('persona_id').references(() => audiences.id),
  type: creativeTypeEnum('type').notNull(),
  status: creativeStatusEnum('status').default('generating').notNull(),
  prompt: text('prompt'),
  variants: jsonb('variants'),
  contentUrl: text('content_url'),
  thumbnailUrl: text('thumbnail_url'),
  aiGenerated: boolean('ai_generated').default(true).notNull(),
  businessGoal: varchar('business_goal', { length: 50 }),
  targetPersonaId: uuid('target_persona_id').references(() => audiences.id),
  predictionScore: decimal('prediction_score', { precision: 5, scale: 2 }),
  aiReasoning: text('ai_reasoning'),
  impactMetrics: jsonb('impact_metrics'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
