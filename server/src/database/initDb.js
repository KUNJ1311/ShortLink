const createTables = async (connection) => {
  try {
    console.log("Initializing database tables...");
    
    await connection.query(`
      USE \`${process.env.DB_NAME}\`;
    `);

    // Links table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(10) NOT NULL UNIQUE COLLATE utf8mb4_bin,
        original_url TEXT NOT NULL,
        total_clicks INT DEFAULT 0,
        last_clicked_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(26) NOT NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_code (code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Analytics table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS link_analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        link_id INT NOT NULL,
        device_type VARCHAR(20) NOT NULL,
        count INT DEFAULT 0,
        last_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE,
        UNIQUE KEY unique_link_device (link_id, device_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database tables:", error);
    throw error;
  }
};

module.exports = createTables;
