const { pool } = require('../database/db');

class AnalyticsService {
  constructor() {
    // Buffer structure:
    // Map<linkId, { clicks: number, lastClicked: Date, devices: { [deviceType]: number } }>
    this.buffer = new Map();
    this.syncInterval = 10000; // 10 seconds
    this.isSyncing = false;
    this.intervalId = null;
  }

  startSyncJob() {
    if (this.intervalId) return;
    console.log('Starting analytics sync job...');
    this.intervalId = setInterval(() => this.flush(), this.syncInterval);
  }

  stopSyncJob() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  trackClick(linkId, deviceType) {
    if (!this.buffer.has(linkId)) {
      this.buffer.set(linkId, {
        clicks: 0,
        lastClicked: new Date(),
        devices: {}
      });
    }

    const entry = this.buffer.get(linkId);
    entry.clicks += 1;
    entry.lastClicked = new Date();

    if (!entry.devices[deviceType]) {
      entry.devices[deviceType] = 0;
    }
    entry.devices[deviceType] += 1;
  }

  async flush() {
    if (this.buffer.size === 0) return;
    if (this.isSyncing) {
      console.log('Analytics sync already in progress, skipping...');
      return;
    }

    this.isSyncing = true;

    const snapshot = new Map(this.buffer);
    this.buffer.clear();

    const connection = await pool.getConnection();
    try {
			await connection.beginTransaction();

			const linkUpdates = [];
			const linkParams = [];

			for (const [linkId, data] of snapshot) {
				linkUpdates.push("WHEN ? THEN total_clicks + ?");
				linkParams.push(linkId, data.clicks);
				linkUpdates.push("WHEN ? THEN ?");
				linkParams.push(linkId, data.lastClicked);
			}

			if (linkUpdates.length > 0) {
				const linkIds = Array.from(snapshot.keys());
				const clicksCases = linkUpdates.filter((_, i) => i % 2 === 0).join(" ");
				const dateCases = linkUpdates.filter((_, i) => i % 2 === 1).join(" ");

				await connection.query(
					`UPDATE links
           SET total_clicks = CASE id ${clicksCases} ELSE total_clicks END,
               last_clicked_at = CASE id ${dateCases} ELSE last_clicked_at END
           WHERE id IN (${linkIds.map(() => "?").join(",")})`,
					[...linkParams, ...linkIds]
				);
			}

			const analyticsValues = [];
			const analyticsParams = [];

			for (const [linkId, data] of snapshot) {
				for (const [deviceType, count] of Object.entries(data.devices)) {
					analyticsValues.push("(?, ?, ?)");
					analyticsParams.push(linkId, deviceType, count);
				}
			}

			if (analyticsValues.length > 0) {
				await connection.query(
					`INSERT IGNORE INTO link_analytics (link_id, device_type, count)
           VALUES ${analyticsValues.join(", ")}
           ON DUPLICATE KEY UPDATE count = count + VALUES(count)`,
					analyticsParams
				);
			}

			await connection.commit();
		} catch (error) {
      console.error('Error flushing analytics:', error);
      await connection.rollback();

      for (const [linkId, data] of snapshot) {
        this.trackClickRestore(linkId, data);
      }
    } finally {
      connection.release();
      this.isSyncing = false;
    }
  }

  trackClickRestore(linkId, data) {
    if (!this.buffer.has(linkId)) {
      this.buffer.set(linkId, {
        clicks: 0,
        lastClicked: data.lastClicked,
        devices: {}
      });
    }
    const entry = this.buffer.get(linkId);
    entry.clicks += data.clicks;

    if (new Date(data.lastClicked) > new Date(entry.lastClicked)) {
      entry.lastClicked = data.lastClicked;
    }

    for (const [device, count] of Object.entries(data.devices)) {
      entry.devices[device] = (entry.devices[device] || 0) + count;
    }
  }
}

module.exports = new AnalyticsService();


/*

*** Query 1: LINKS UPDATE ***

UPDATE links
SET total_clicks = CASE id 
    WHEN 1 THEN total_clicks + 8
    WHEN 2 THEN total_clicks + 2
    WHEN 3 THEN total_clicks + 1
    ELSE total_clicks END,
    last_clicked_at = CASE id 
    WHEN 1 THEN '2025-11-22 10:30:45'
    WHEN 2 THEN '2025-11-22 10:30:42'
    WHEN 3 THEN '2025-11-22 10:30:40'
    ELSE last_clicked_at END
WHERE id IN (1, 2, 3)



*** Query 2: ANALYTICS INSERT ***

INSERT IGNORE INTO link_analytics (link_id, device_type, count)
VALUES 
    (1, 'mobile', 5),
    (1, 'desktop', 3),
    (2, 'tablet', 2),
    (3, 'mobile', 1)
ON DUPLICATE KEY UPDATE count = count + VALUES(count)

*/