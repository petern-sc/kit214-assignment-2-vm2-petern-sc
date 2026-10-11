CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(255) NOT NULL,
  sender VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  created_at CHAR(24) NOT NULL,
  INDEX index_chat_messages_booking (booking_id, id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS canvas_elements (
  booking_id VARCHAR(255) NOT NULL,
  id VARCHAR(255) NOT NULL,
  element_type JSON NULL,
  shape_type VARCHAR(255) NULL,
  x DOUBLE NULL,
  y DOUBLE NULL,
  color JSON NULL,
  content TEXT NULL,
  `text` TEXT NULL,
  width DOUBLE NULL,
  height DOUBLE NULL,
  PRIMARY KEY (booking_id, id)
) ENGINE=InnoDB;
