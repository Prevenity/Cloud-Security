function vms_inventory_main(){

  var pageToken = 0;
  var table_with_vms = [];
  var date_of_scan_vms = Utilities.formatDate(new Date(), "GMT+2", "dd/MM/yyyy");

 do {
      const payload = {
      method: "GET",
      contentType: 'application/json',
      muteHttpExceptions: true,
      requestedPolicyVersion: 3,
      headers: {
        Authorization: 'Bearer ' + getAccessToken()
       }};

     var   url_request = "https://cloudasset.googleapis.com/v1/organizations/"+GCP_Org_ID+"/:searchAllResources?assetTypes=compute.googleapis.com/Instance&readMask=additionalAttributes,displayName,createTime,state,parentFullResourceName,labels";

    if (pageToken != 0){
       url_request = url_request + "&pageToken=" + pageToken;
     }

    var pageX2 = JSON.parse(UrlFetchApp.fetch(url_request,payload).getContentText());
    let result4 = pageX2.results;

     if (result4 && result4.length > 0) {
        for(zm4 = 0; zm4 < result4.length; zm4++){
          //part related to prepare name of project
          var minBoundary2 = "projects/";
          var min2 = result4[zm4].parentFullResourceName.indexOf(minBoundary2) + minBoundary2.length;
          var max2 = result4[zm4].parentFullResourceName.length;
          var name_of_project = result4[zm4].parentFullResourceName.substring(min2,max2);
          //name of VM
          let name_of_vm = result4[zm4].displayName;
          //part related to labels
          var env_data = ""
           if(result4[zm4].labels)
           {
            if(result4[zm4].labels.environment)
              env_data = result4[zm4].labels.environment; //label env
            if(result4[zm4].labels.env)
              env_data = result4[zm4].labels.env; //label env
           }
          //part related to vulerabilities

               if(result4[zm4].state != "TERMINATED"){
                  table_with_vms.push([name_of_vm, result4[zm4].additionalAttributes.osLongName, result4[zm4].additionalAttributes.osShortName , name_of_project ,result4[zm4].createTime, result4[zm4].additionalAttributes.externalIPs,result4[zm4].additionalAttributes.internalIPs, date_of_scan_vms, env_data]);
                } 
        }

      }
  pageToken = pageX2.nextPageToken;
 } while(pageToken)

  var handler02 = SpreadsheetApp.openById(Cache_DB);
  var tab_for_all_vms = handler02.getSheetByName("COMPUTE_ENGINES");
  tab_for_all_vms.clear();

  if(table_with_vms.length > 0){
    tab_for_all_vms.getRange(1, 1, table_with_vms.length, table_with_vms[0].length).setValues(table_with_vms);
    }

}


function run_scheduled_scan_vm_asset_inventory(){

var loaded_vm_table = open_spreadsheet_tab(Cache_DB, "COMPUTE_ENGINES");

       for(var counter_02 = 0; counter_02 < loaded_vm_table.length; counter_02++){

    var vm_name = loaded_vm_table[counter_02][0].toString();
    var date_of_scan = loaded_vm_table[counter_02][7];
    var label_product_name = loaded_vm_table[counter_02][8].toString();
    var project__name = loaded_vm_table[counter_02][3].toString();
    var os_type = loaded_vm_table[counter_02][1];
    var external_ip = loaded_vm_table[counter_02][5];
    var internal_ip = loaded_vm_table[counter_02][6];


    //load file
    //check and save or only update
    //var inventory_db_file = open_spreadsheet_tab(Inventory_DB,"GKE_ASSETS")

    var inventory_db_file = SpreadsheetApp.openById(Inventory_DB);
    var inventory_db_file_tab = inventory_db_file.getSheetByName("COMPUTE_ENGINES");
    var inventory_db_file_tab_data = inventory_db_file_tab.getDataRange().getValues();
    //Logger.log("load Inventory_DB")
    //Logger.log(inventory_db_file_tab_data.length)
    var flag_update_only = 0;


     for (var counter_03 = 0; counter_03< inventory_db_file_tab_data.length; counter_03++){

      var vm_name_1 = inventory_db_file_tab_data[counter_03][0];

      if(vm_name == vm_name_1)
      {
        flag_update_only=1;
        break;
      }


     }
      if(flag_update_only==0){
      inventory_db_file_tab.appendRow([vm_name,,project__name,date_of_scan,,label_product_name,,,,,,,,,os_type,internal_ip,external_ip]); 
      }

      if(flag_update_only==1){
        inventory_db_file_tab.getRange((counter_03+1),4).setValue(date_of_scan) 
        inventory_db_file_tab.getRange((counter_03+1),3).setValue(project__name)
        inventory_db_file_tab.getRange((counter_03+1),6).setValue(label_product_name)
        inventory_db_file_tab.getRange((counter_03+1),15).setValue(os_type)
        inventory_db_file_tab.getRange((counter_03+1),16).setValue(internal_ip)
        inventory_db_file_tab.getRange((counter_03+1),17).setValue(external_ip)

      }

    }


}
