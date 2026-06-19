import { pgTable, serial, text, boolean, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const spiderScansTable = pgTable("spider_scans", {
  id: serial("id").primaryKey(),
  spiderName: text("spider_name").notNull(),
  scientificName: text("scientific_name").notNull(),
  confidence: real("confidence").notNull(),
  isDangerous: boolean("is_dangerous").notNull().default(false),
  dangerLevel: text("danger_level"),
  habitat: text("habitat").notNull(),
  diet: text("diet").notNull(),
  lifespan: text("lifespan").notNull(),
  facts: jsonb("facts").$type<string[]>().notNull().default([]),
  safetyInfo: text("safety_info").notNull(),
  relatedSpecies: jsonb("related_species").$type<string[]>().notNull().default([]),
  imageBase64: text("image_base64"),
  analyzedAt: timestamp("analyzed_at").notNull().defaultNow(),
});

export const biteScansTable = pgTable("bite_scans", {
  id: serial("id").primaryKey(),
  possibleSpider: text("possible_spider").notNull(),
  dangerLevel: text("danger_level").notNull(),
  symptoms: jsonb("symptoms").$type<string[]>().notNull().default([]),
  safetyTips: jsonb("safety_tips").$type<string[]>().notNull().default([]),
  recommendation: text("recommendation").notNull(),
  imageBase64: text("image_base64"),
  analyzedAt: timestamp("analyzed_at").notNull().defaultNow(),
});

export const insertSpiderScanSchema = createInsertSchema(spiderScansTable).omit({ id: true, analyzedAt: true });
export const insertBiteScanSchema = createInsertSchema(biteScansTable).omit({ id: true, analyzedAt: true });

export type InsertSpiderScan = z.infer<typeof insertSpiderScanSchema>;
export type SpiderScan = typeof spiderScansTable.$inferSelect;
export type InsertBiteScan = z.infer<typeof insertBiteScanSchema>;
export type BiteScan = typeof biteScansTable.$inferSelect;
