function Logins(starts, ends) {
    var pageToken, responseX;
    var userKey = "all";
    var applicationName = "login";
    var table = [];

    do {
        var optionalArgs = {
            maxResults: 20,
            startTime: starts,
            endTime: ends,
            pageToken: pageToken,
        };
        responseX = AdminReports.Activities.list(
            userKey,
            applicationName,
            optionalArgs
        );
        var activities = responseX.items;
        if (activities && activities.length > 0) {
            for (i = 0; i < activities.length; i++) {
                var activity = activities[i];
                if (
                    activity.events[0].name == "login_failure" ||
                    activity.events[0].name == "login_success"
                )
                    table.push([
                        activity.actor.email,
                        activity.events[0].name,
                        activity.id.time,
                        activity.ipAddress,
                    ]);
            }
        } else {
            Logger.log("No logins found.");
        }

        pageToken = responseX.nextPageToken;
    } while (pageToken);

    return table;
}
