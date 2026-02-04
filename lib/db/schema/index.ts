import { pgTable, uuid, varchar, text, decimal, timestamp, boolean, jsonb, date, bigint, integer } from 'drizzle-orm/pg-core';

// Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Platform Connections (Integration Mesh)
export const platformConnections = pgTable('platform_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  platform: varchar('platform', { length: 50 }).notNull(), // 'meta', 'google', 'tiktok', 'line', 'lemon8'
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accountId: varchar('account_id', { length: 255 }),
  status: varchar('status', { length: 20 }).default('active'), // 'active', 'inactive', 'error'
  lastSyncAt: timestamp('last_sync_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Campaigns
export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  objective: varchar('objective', { length: 100 }), // 'awareness', 'consideration', 'conversion'
  status: varchar('status', { length: 50 }).default('draft'), // 'draft', 'active', 'paused', 'completed'
  budget: decimal('budget', { precision: 15, scale: 2 }),
  startDate: date('start_date'),
  endDate: date('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Audiences / Personas (Intelligent Targeting)
export const audiences = pgTable('audiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  personaType: varchar('persona_type', { length: 100 }),
  demographics: jsonb('demographics'), // { ageRange, genderSplit, locations }
  psychographics: jsonb('psychographics'), // { values, painPoints, motivations }
  behaviors: jsonb('behaviors'), // { platforms, contentPreferences, purchaseTriggers }
  interests: jsonb('interests'),
  intentScore: decimal('intent_score', { precision: 5, scale: 2 }),
  segmentSize: integer('segment_size'),
  aiGenerated: boolean('ai_generated').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Creatives (Generative Creative Studio)
export const creatives = pgTable('creatives', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  audienceId: uuid('audience_id').references(() => audiences.id),
  type: varchar('type', { length: 50 }), // 'image', 'video', 'copy'
  title: varchar('title', { length: 255 }),
  headline: text('headline'),
  bodyCopy: text('body_copy'),
  contentUrl: text('content_url'),
  thumbnailUrl: text('thumbnail_url'),
  aiPrompt: text('ai_prompt'),
  aiGenerated: boolean('ai_generated').default(false),
  status: varchar('status', { length: 50 }).default('draft'), // 'draft', 'approved', 'deployed'
  createdAt: timestamp('created_at').defaultNow(),
});

// Campaign Deployments
export const deployments = pgTable('deployments', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  creativeId: uuid('creative_id').references(() => creatives.id),
  audienceId: uuid('audience_id').references(() => audiences.id),
  platform: varchar('platform', { length: 50 }).notNull(), // 'meta', 'google', 'tiktok', 'line', 'lemon8'
  platformCampaignId: varchar('platform_campaign_id', { length: 255 }),
  allocatedBudget: decimal('allocated_budget', { precision: 15, scale: 2 }),
  status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'active', 'paused', 'completed'
  deployedAt: timestamp('deployed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Analytics / Performance Data
export const analytics = pgTable('analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  deploymentId: uuid('deployment_id').references(() => deployments.id),
  date: date('date').notNull(),
  impressions: bigint('impressions', { mode: 'number' }).default(0),
  clicks: bigint('clicks', { mode: 'number' }).default(0),
  conversions: integer('conversions').default(0),
  spend: decimal('spend', { precision: 15, scale: 2 }).default('0'),
  revenue: decimal('revenue', { precision: 15, scale: 2 }).default('0'),
  ctr: decimal('ctr', { precision: 8, scale: 4 }),
  cpa: decimal('cpa', { precision: 15, scale: 2 }),
  roas: decimal('roas', { precision: 8, scale: 4 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// AI Optimization Logs
export const optimizationLogs = pgTable('optimization_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  actionType: varchar('action_type', { length: 100 }), // 'budget_reallocation', 'bid_adjustment', 'creative_refresh'
  previousState: jsonb('previous_state'),
  newState: jsonb('new_state'),
  aiReasoning: text('ai_reasoning'),
  appliedBy: varchar('applied_by', { length: 50 }), // 'ai', 'human'
  appliedAt: timestamp('applied_at').defaultNow(),
});
