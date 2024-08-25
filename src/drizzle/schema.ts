import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const typeEnum = pgEnum("type", ["FOLDER", "FILE"]);
export const fileTypeEnum = pgEnum("file_type", ["txt", "md"]);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  date: text("data"),
  isCompleted: boolean("is_completed"),
  isImportant: boolean("is_important"),
  userId: text("user_id"),
  createdAt: timestamp("created_at", { mode: "string" })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .default(sql`now()`),
});

export const trees = pgTable("trees", {
  id: serial("id").primaryKey(),
  name: text("title").notNull(),
  type: typeEnum("type").notNull(),
  fileType: fileTypeEnum("file_type"),
  level: integer("level").notNull(),
  isOpen: boolean("is_open").notNull(),
  parentId: text("parent_id"),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { mode: "string" })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .default(sql`now()`),
});
