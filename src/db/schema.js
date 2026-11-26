import { pgTable, serial, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  bio: text('bio').default(''),
  photo: text('photo').default(''),
  tg: text('tg').default(''),
  ig: text('ig').default(''),
  mail: text('mail').default(''),
  sortOrder: integer('sort_order').default(0),
});

export const issues = pgTable('issues', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  cover: text('cover').notNull(),
  file: text('file').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  cat: text('cat').default('خبر').notNull(),
  day: text('day').notNull(),
  month: text('month').notNull(),
  title: text('title').notNull(),
  text: text('text').notNull(),
  place: text('place').default(''),
  img: text('img').default(''),
  href: text('href').default('#'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const nextEvent = pgTable('next_event', {
  id: serial('id').primaryKey(),
  tag: text('tag').default('رویداد پیش‌رو').notNull(),
  day: text('day').notNull(),
  month: text('month').notNull(),
  title: text('title').notNull(),
  time: text('time').notNull(),
  place: text('place').notNull(),
  href: text('href').default('#'),
});

export const awards = pgTable('awards', {
  id: serial('id').primaryKey(),
  year: text('year').notNull(),        // e.g. '۱۴۰۴'
  icon: text('icon').default('trophy'), // 'trophy' | 'medal' | 'star' | 'book' | 'users'
  type: text('type').notNull(),        // 'جایزه' | 'تقدیرنامه' | 'انتشار' | 'رویداد'
  best: boolean('best').default(false),
  title: text('title').notNull(),
  text: text('text').notNull(),
  org: text('org').notNull(),
});