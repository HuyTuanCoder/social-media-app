DELIMITER //

CREATE PROCEDURE CountFriends(IN userId VARCHAR(255))
BEGIN
    SELECT COUNT(*) AS totalFriends
    FROM Friendship
    WHERE userAId = userId OR userBId = userId;
END //

DELIMITER ;