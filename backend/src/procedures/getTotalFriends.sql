DELIMITER //

CREATE PROCEDURE GetTotalFriends(IN userId VARCHAR(255), OUT totalFriends INT)
BEGIN
    SELECT COUNT(*) INTO totalFriends
    FROM Friendship
    WHERE userAId = userId OR userBId = userId;
END //

DELIMITER ;