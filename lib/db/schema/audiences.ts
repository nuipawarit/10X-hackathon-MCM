import { pgTable, uuid, varchar, text, integer, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';
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
  aiGenerated: boolean('ai_generated').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
