DELIMITER //

CREATE PROCEDURE GetMostMessagedBy(IN userId VARCHAR(255), OUT mostMessagedBy VARCHAR(255))
BEGIN
    SELECT u.username INTO mostMessagedBy
    FROM Message m
    JOIN Chat c ON m.chatId = c.id
    JOIN User u ON (u.id = c.userAId OR u.id = c.userBId) AND u.id != userId
    WHERE m.senderId != userId AND (c.userAId = userId OR c.userBId = userId)
    GROUP BY u.id
    ORDER BY COUNT(*) DESC
    LIMIT 1;
END //

DELIMITER ;