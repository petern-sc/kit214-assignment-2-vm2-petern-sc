CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(255) NOT NULL,
  sender VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  created_at CHAR(24) NOT NULL,
  INDEX index_chat_messages_booking (booking_id, id)
) ENGINE=InnoDB;
