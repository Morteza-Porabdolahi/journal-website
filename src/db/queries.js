import { asc, desc } from 'drizzle-orm';
import { db } from './index';
import { members, issues, news, nextEvent, awards } from './schema';

export async function getMembers() {
  return db.select().from(members).orderBy(asc(members.sortOrder), asc(members.id));
}

export async function getIssues() {
  return db.select().from(issues).orderBy(desc(issues.id));
}

export async function getNews() {
  return db.select().from(news).orderBy(desc(news.id));
}

export async function getNextEvent() {
  const rows = await db.select().from(nextEvent).limit(1);
  return rows[0] || null;
}

export async function getAwardsGrouped() {
  const rows = await db.select().from(awards).orderBy(desc(awards.year), asc(awards.id));
  const grouped = {};

  for (let row of rows) {
    if (!grouped[row.year]) grouped[row.year] = [];
    grouped[row.year].push({
      id: row.id,
      icon: row.icon,
      type: row.type,
      best: row.best,
      title: row.title,
      text: row.text,
      org: row.org,
    });
  }

  return Object.entries(grouped).map(([year, items]) => ({ year, items }));
}