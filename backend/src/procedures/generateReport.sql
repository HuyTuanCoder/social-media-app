DELIMITER //

DROP PROCEDURE IF EXISTS GenerateReport; //

CREATE PROCEDURE GenerateReport(
    IN userId VARCHAR(255)
)
BEGIN
    -- Temporary variables
    SET @totalUsers = 0;
    SET @totalFriends = 0;
    SET @totalMessagesSent = 0;
    SET @mostMessagedUser = '';
    SET @mostMessagedBy = '';

    -- Call individual procedures
    CALL GetTotalUsers(@totalUsers);
    CALL GetTotalFriends(userId, @totalFriends);
    CALL GetTotalMessagesSent(userId, @totalMessagesSent);
    CALL GetMostMessagedUser(userId, @mostMessagedUser);
    CALL GetMostMessagedBy(userId, @mostMessagedBy);

    -- Return the result set
    SELECT 
        @totalUsers AS totalUsers,
        @totalFriends AS totalFriends,
        @totalMessagesSent AS totalMessagesSent,
        @mostMessagedUser AS mostMessagedUser,
        @mostMessagedBy AS mostMessagedBy;
END //

DELIMITER ;