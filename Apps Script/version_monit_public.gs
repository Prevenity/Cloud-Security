function main_version_monitor() {
  //main function to check OS version

  var dates = read_dates(); //read dates of last script execution and write current date of execution
  var entries_to_monitor2 = read_events(dates[1][0], dates[0][0]); //call function of reading events from gsuite

  var ntablica2 = [];

  for (uio2 = 0; uio2 < entries_to_monitor2.length; uio2++) {
    Logger.log(entries_to_monitor2[uio2]);
    if (entries_to_monitor2[uio2][6] != "unknown")
      ntablica2.push([
        entries_to_monitor2[uio2][0],
        entries_to_monitor2[uio2][4],
        entries_to_monitor2[uio2][6],
        entries_to_monitor2[uio2][3],
      ]);
  }

  var size_table = ntablica2.length;
  if (size_table > 0) {
    for (var uuz = 0; uuz < size_table; uuz++) {
      var result_of_check = compare_version_v2(ntablica2[uuz][2]);

      if (result_of_check == false) {
        var iOS_text =
          "iOS: https://support.apple.com/en-us/HT204204#:~:text=Go%20to%20Settings%20%3E%20General%20%3E%20Software,version%20of%20iOS%20or%20iPadOS.";
        var macOS_text = "";
        var android_text =
          "Android information about update procedure: https://support.google.com/android/answer/7680439?hl=en";
        var windows = "";
        var linux = "";

        var text_do = "Hello " + ntablica2[uuz][0] + "<br>";
        var content =
          '<b style="color:red"><br>Please update your operating system: ' +
          ntablica2[uuz][2] +
          " to the latest version.</b><br>";
        var endend = "</b>";

        var android2 =
          "<br>Your Android device has not been updated for at least 150 days....<br><br>";

        var full_text = text_do + content;
        var full_text2 = text_do + content;

        if (ntablica2[uuz][1] == "WINDOWS" || ntablica2[uuz][1] == "LINUX") {
          Logger.log("");
          //other script is called.
        } else {
          if (ntablica2[uuz][1] == "MAC") {
            MailApp.sendEmail(
              ntablica2[uuz][0],
              "[Action required] Update MacOS device",
              "",
              {
                htmlBody: full_text + macOS_text + endend,
                noReply: true,
              }
            );
          }

          if (ntablica2[uuz][1] == "iOS") {
            MailApp.sendEmail(
              ntablica2[uuz][0],
              "[Action required] Update iOS device",
              "",
              {
                htmlBody: full_text + iOS_text + endend,
                noReply: true,
              }
            );
          }

          if (ntablica2[uuz][1] == "ANDROID") {
            if (check_android_patch_date(ntablica2[uuz][3]) == true)
              MailApp.sendEmail(
                ntablica2[uuz][0],
                "[Action required] Update Android device.",
                "",
                {
                  htmlBody: full_text + android2 + android_text + endend,
                  noReply: true,
                }
              );
          }
        }
      }
    } //end of for
  } //end of IF
}

function check_android_patch_date(serial_value) {
  var mobiles_db = open_spreadsheet_file("", "");
  var result_check = 0;
  for (var countx2 = 0; countx2 < mobiles_db.length; countx2++) {
    if (mobiles_db[countx2][7] == serial_value) {
      //serial or device id
      result_check = old_update(mobiles_db[countx2][5]);
      if (result_check == true) {
        return true;
      }
      if (result_check == false) {
        return false;
      }
    }
  }
}

function old_update(epoch1) {
  const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;

  var datenew = new Date();

  if (datenew.getTime() / MILLIS_PER_DAY - epoch1 / MILLIS_PER_DAY > 150) {
    //update older than 150 days
    return true;
  } else {
    return false;
  }
}

function compare_version_v2(version_to_check) {
  var handler_to_file = open_spreadsheet_file("", "supported versions");

  for (var zmx = 1; zmx < handler_to_file[10].length; zmx++) {
    if (handler_to_file[10][zmx] == version_to_check) return true;
  }

  return false;
}

function update_mobile_devices_ios_android() {
  //dump all mobile devices

  customerId = "";
  var pageToken;
  var Device_compliance_file = "";

  var handler2 = SpreadsheetApp.openById("");
  var tab_devices = handler2.getSheetByName("");

  var dane_device = [];

  do {
    var page = AdminDirectory.Mobiledevices.list(customerId, {
      orderBy: "EMAIL",
      maxResults: 20,
      pageToken: pageToken,
    });

    var device_temp = page.mobiledevices;
    var size_devices = device_temp.length;
    for (
      var number_devices = 0;
      number_devices < size_devices;
      number_devices++
    ) {
      dane_device.push([
        device_temp[number_devices].email,
        device_temp[number_devices].status,
        device_temp[number_devices].model,
        device_temp[number_devices].os,
        device_temp[number_devices].type,
        device_temp[number_devices].securityPatchLevel,
        device_temp[number_devices].deviceId,
        device_temp[number_devices].serialNumber,
        device_temp[number_devices].resourceId,
        device_temp[number_devices].deviceCompromisedStatus,
        device_temp[number_devices].buildNumber,
        device_temp[number_devices].manufacturer,
        device_temp[number_devices].releaseVersion,
        device_temp[number_devices].hardware,
        device_temp[number_devices].encryptionStatus,
        device_temp[number_devices].devicePasswordStatus,
        device_temp[number_devices].managedAccountIsOnOwnerProfile,
        device_temp[number_devices].userAgent,
      ]);
    }

    pageToken = page.nextPageToken;
  } while (pageToken);

  tab_devices.getDataRange().clear();
  tab_devices
    .getRange(1, 1, dane_device.length, dane_device[0].length)
    .setValues(dane_device);
}

function read_events(sdate, edate) {
  var start_data = sdate;
  var end_data = edate;

  var userKeyA = "all";
  var applicationNameA = "mobile";
  var pageToken, response;
  var table_mobile = [];

  do {
    var optionalArgsA = {
      maxResults: 20,
      startTime: start_data,
      endTime: end_data,
      pageToken: pageToken,
    };
    try {
      response = AdminReports.Activities.list(
        userKeyA,
        applicationNameA,
        optionalArgsA
      );
    } catch (error) {
      Logger.log(error);
    }

    var abcdef = response.items;

    if (abcdef && abcdef.length > 0) {
      for (var zm2 = 0; zm2 < abcdef.length; zm2++) {
        var event_temp = abcdef[zm2];
        var device_type_vod, device_model_vod, os_version_vod, serial_id_vod;
        os_version_vod = "unknown";
        for (var zm3 = 0; zm3 < event_temp.events.length; zm3++) {
          var params_event = event_temp.events[zm3].parameters;

          for (var zm4 = 0; zm4 < params_event.length; zm4++) {
            if (params_event[zm4].name == "DEVICE_TYPE")
              device_type_vod = params_event[zm4].value;
            if (params_event[zm4].name == "DEVICE_MODEL")
              device_model_vod = params_event[zm4].value;
            if (params_event[zm4].name == "OS_VERSION")
              os_version_vod = params_event[zm4].value;
            if (params_event[zm4].name == "SERIAL_NUMBER")
              //we can also use device_id.
              serial_id_vod = params_event[zm4].value;
          }
        }
        table_mobile.push([
          event_temp.actor.email,
          event_temp.actor.callerType,
          event_temp.id.time,
          serial_id_vod,
          device_type_vod,
          device_model_vod,
          os_version_vod,
        ]);
      }
    }
    pageToken = response.nextPageToken;
  } while (pageToken);
  return table_mobile;
}

function read_dates() {
  var handX2 = open_spreadsheet_file("", "");

  var now2 = new Date();
  now2.getTime();
  var new_endTime112 = now2.toISOString();

  var start_2 = handX2[0][0];
  var ret_tab = [];

  ret_tab.push([new_endTime112, "Last Exec Time"]);
  ret_tab.push([start_2, "start"]);

  handX2.getRange(1, 1).setValue(new_endTime112); //

  return ret_tab;
}

