import { Router } from "express";
import { db } from "@workspace/db";
import { spiderScansTable, biteScansTable } from "@workspace/db";
import { desc, eq, and, gte, sql } from "drizzle-orm";

const router = Router();

// GET /api/history
router.get("/history", async (req, res) => {
  const { search, filter } = req.query as { search?: string; filter?: string };

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    // Fetch both spider and bite scans
    const spiderScans = await db.select().from(spiderScansTable).orderBy(desc(spiderScansTable.analyzedAt));
    const biteScans = await db.select().from(biteScansTable).orderBy(desc(biteScansTable.analyzedAt));

    // Merge into unified history format
    let history = [
      ...spiderScans.map((s) => ({
        id: s.id * 2 - 1, // unique composite ID
        type: "spider" as const,
        name: s.spiderName,
        isDangerous: s.isDangerous,
        confidence: s.confidence,
        imageBase64: s.imageBase64,
        createdAt: s.analyzedAt.toISOString(),
        _date: s.analyzedAt,
        _spiderId: s.id,
      })),
      ...biteScans.map((b) => ({
        id: b.id * 2, // unique composite ID
        type: "bite" as const,
        name: b.possibleSpider,
        isDangerous: b.dangerLevel === "high" || b.dangerLevel === "medium",
        confidence: null as number | null,
        imageBase64: b.imageBase64,
        createdAt: b.analyzedAt.toISOString(),
        _date: b.analyzedAt,
        _biteId: b.id,
      })),
    ].sort((a, b) => b._date.getTime() - a._date.getTime());

    // Apply search filter
    if (search) {
      const q = search.toLowerCase();
      history = history.filter((h) => h.name.toLowerCase().includes(q));
    }

    // Apply type/time filter
    if (filter && filter !== "all") {
      if (filter === "dangerous") {
        history = history.filter((h) => h.isDangerous);
      } else if (filter === "safe") {
        history = history.filter((h) => !h.isDangerous);
      } else if (filter === "today") {
        history = history.filter((h) => h._date >= startOfDay);
      } else if (filter === "this_week") {
        history = history.filter((h) => h._date >= startOfWeek);
      }
    }

    res.json(
      history.map(({ _date, _spiderId, _biteId, ...h }) => h)
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get history");
    res.status(500).json({ error: "Failed to retrieve history" });
  }
});

// DELETE /api/history/:id
router.delete("/history/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    // Determine if spider or bite based on ID parity
    if (id % 2 === 1) {
      const spiderId = (id + 1) / 2;
      const result = await db.delete(spiderScansTable).where(eq(spiderScansTable.id, spiderId)).returning();
      if (!result.length) {
        res.status(404).json({ error: "Not found" });
        return;
      }
    } else {
      const biteId = id / 2;
      const result = await db.delete(biteScansTable).where(eq(biteScansTable.id, biteId)).returning();
      if (!result.length) {
        res.status(404).json({ error: "Not found" });
        return;
      }
    }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete history item");
    res.status(500).json({ error: "Failed to delete" });
  }
});

// DELETE /api/history/clear
router.delete("/history/clear", async (req, res) => {
  try {
    await db.delete(spiderScansTable);
    await db.delete(biteScansTable);
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to clear history");
    res.status(500).json({ error: "Failed to clear history" });
  }
});

// GET /api/history/stats
router.get("/history/stats", async (req, res) => {
  try {
    const spiderScans = await db.select().from(spiderScansTable);
    const biteScans = await db.select().from(biteScansTable);

    const dangerousSpiders = spiderScans.filter((s) => s.isDangerous).length;
    const dangerousBites = biteScans.filter((b) => b.dangerLevel === "high" || b.dangerLevel === "medium").length;

    const totalScans = spiderScans.length + biteScans.length;
    const dangerousFound = dangerousSpiders + dangerousBites;

    res.json({
      totalScans,
      dangerousFound,
      safeFound: totalScans - dangerousFound,
      spiderScans: spiderScans.length,
      biteScans: biteScans.length,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Failed to retrieve stats" });
  }
});

export default router;
