function getIpGeolocationData(ip = "", returnType = "") {
    try {
        ipData = isBlank(ip)
            ? getResponseJsonData("https://api.ipbase.com/v2/info")
            : getResponseJsonData("https://api.ipbase.com/v2/info?ip=" + ip);
    } catch (error) {
        return "Request error";
    }

    if (isBlank(ipData)) return "Response error";

    let locationData;

    switch (returnType.toUpperCase()) {
        case "CITY":
            locationData = ipData["city"];
            break;

        case "COUNTRY":
            locationData = ipData["country_name"];
            break;

        default:
            var datas = ipData["data"];
            var locations = datas["location"];
            var cities = locations["city"];

            var conutries = locations["country"];
            var continents = locations["continent"];

            locationData =
                cities.name +
                ", " +
                conutries.alpha2 +
                ", " +
                conutries.name +
                ", " +
                continents.name;

            break;
    }

    return locationData;
}
function getResponseJsonData(url) {
    if (isBlank(url)) return;

    let response = UrlFetchApp.fetch(url, {
        headers: {
            apikey: APIKEY,
        },
    });

    let json = response.getContentText();

    return JSON.parse(json);
}
function isBlank(str) {
    return !str || /^\s*$/.test(str);
}

