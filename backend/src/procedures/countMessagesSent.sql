DELIMITER //

CREATE PROCEDURE CountMessagesSent(IN userId VARCHAR(255))
BEGIN
    SELECT COUNT(*) AS totalMessagesSent
    FROM Message
    WHERE senderId = userId;
END //

DELIMITER ;