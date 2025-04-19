DELIMITER //

CREATE PROCEDURE FavoriteSender(IN userId VARCHAR(255))
BEGIN
    SELECT senderId, COUNT(*) AS messageCount
    FROM Message
    WHERE chatId IN (
        SELECT id
        FROM Chat
        WHERE userAId = userId OR userBId = userId
    )
    AND senderId != userId
    GROUP BY senderId
    ORDER BY messageCount DESC
    LIMIT 1;
END //

DELIMITER ;