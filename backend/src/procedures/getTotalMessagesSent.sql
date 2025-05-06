DELIMITER //

CREATE PROCEDURE GetTotalMessagesSent(IN userId VARCHAR(255), OUT totalMessagesSent INT)
BEGIN
    SELECT COUNT(*) INTO totalMessagesSent
    FROM Message
    WHERE senderId = userId;
END //

DELIMITER ;