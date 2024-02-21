
function gke_inventory_main(){

for (var counter = 0; counter < config_scope.length; counter++)
  {   
  //Asset inventory for GKE Cluster
   if(config_scope[counter] == "GKE_CLUSTERS") {
       Logger.log("GKE_CLUSTERS is RUNNING")
       var gke_cluster_list = open_spreadsheet_tab(Cache_DB, "GKE_Clusters")

       for (var zmienna = 0; zmienna<gke_cluster_list.length; zmienna++)
        {
          if(gke_cluster_list[zmienna][3] == "RUNNING")
          {
              //enumerate all deployments
              var res = enumerate_workloads(gke_cluster_list[zmienna][1]);
              write_to_spreadsheet_tab(Cache_DB, gke_cluster_list[zmienna][1], res);
              //enumerate all pods
              var res2 = double_check_retrive_pod_full_list(gke_cluster_list[zmienna][1]);
              attach_to_spreadsheet_tab(Cache_DB, gke_cluster_list[zmienna][1], res2);
              //remove duplicates
              helper_remove_duplicates(gke_cluster_list[zmienna][1])
          } 
        }
    }
  }
}




//check deployment list
function enumerate_workloads(gkecluster) {

  const payload = {
    method: "GET",
    contentType: 'application/json',
    muteHttpExceptions: true,
    requestedPolicyVersion: 3,
    headers: {
      Authorization: 'Bearer ' + getAccessToken()
    }
  };
  var pageToken = 0 ;
  var results = [];
  var results_final = [];
  var data_skanu = Utilities.formatDate(new Date(), "GMT+2", "dd/MM/yyyy");
  var licznik = 0;
  do {
    //deployments
    var url = "https://cloudasset.googleapis.com/v1/projects/"+gkecluster+":searchAllResources?assetTypes=apps.k8s.io/Deployment&readMask=displayName,parentFullResourceName,labels";
     if (pageToken != 0){
       url = url + "&pageToken=" + pageToken;
     }

    var page = JSON.parse(UrlFetchApp.fetch(url,payload).getContentText());
    let pods = page.results;
     
    if(pods && pods.length > 0){
      for(let i=0, len=pods.length; i<len; i++){
        var podslist = pods[i]
        var minBoundary = "namespaces/";
        var min = podslist.parentFullResourceName.indexOf(minBoundary) + minBoundary.length;
        var max = podslist.parentFullResourceName.length;
        var name2 = podslist.parentFullResourceName.substring(min,max);
        if(podslist.labels)
         {
           labelka_pods = podslist.labels.product;
         }
         else
         {
           labelka_pods = "undefined"
         }

        results_final.push([podslist.displayName,name2,data_skanu,gkecluster,labelka_pods,"deployment"])

      
      }
    }  
    
    pageToken = page.nextPageToken;
    //break;
    
       

  } while(pageToken)

 return results_final;
}

//============================================================

//check with pod list
function double_check_retrive_pod_full_list(gke_cluster){
    const payload = {
      method: "GET",
      contentType: 'application/json',
      muteHttpExceptions: true,
      requestedPolicyVersion: 3,
      headers: {
        Authorization: 'Bearer ' + getAccessToken()
      }
    };
 
  var pageToken = 0 ;
  var sus_table = [];
  var scan_date = Utilities.formatDate(new Date(), "GMT+2", "dd/MM/yyyy");
  var lista_all_apps = helper_retrive_deployment_names(gke_cluster);

  do {
 
    var url_a = "https://cloudasset.googleapis.com/v1/projects/"+gke_cluster+":searchAllResources?assetTypes=k8s.io/Pod";
    if (pageToken != 0){
       url_a = url_a + "&pageToken=" + pageToken;
  
     }

    var page_pods = JSON.parse(UrlFetchApp.fetch(url_a,payload).getContentText());
    let pods_list = page_pods.results;
    if(pods_list && pods_list.length > 0){
      for(let i=0, len=pods_list.length; i<len; i++){

        var podslist = pods_list[i]
        var minBoundary = "namespaces/";
        var min = podslist.parentFullResourceName.indexOf(minBoundary) + minBoundary.length;
        var max = podslist.parentFullResourceName.length;
        var name2 = podslist.parentFullResourceName.substring(min,max);
     
        let nazwa_apki = pods_list[i].displayName;
        var falg_if_true = 0;

       for(var count_0 = 0; count_0<lista_all_apps.length; count_0++)
       {
         if((nazwa_apki.startsWith(lista_all_apps[count_0]) == true))
              {
              falg_if_true = 1;
              break;
              }
       }
      if(falg_if_true == 0)
       {
         if(pods_list[i].labels) {
          var zmienna2 = {}
          zmienna2 = pods_list[i].labels;
          if(zmienna2["statefulset.kubernetes.io/pod-name"] != null){
            if(zmienna2["product"] != null)
              {
                labelka_pods = zmienna2.product;
              }
              else
              {
                labelka_pods = "undefined"
              }
           sus_table.push([nazwa_apki, name2 , scan_date, gke_cluster, labelka_pods, "statefullset"]);
           }          
         }
       }

      }
    }

       pageToken = page_pods.nextPageToken;

  } while(pageToken)


return sus_table;

}


//===========================================================
//enumerate gcp gke clusters
//return list of clusters with status, creation date, name
function list_gke_clusters(org_id){
  var pageToken = 0;
  var wynik = [];
  var scan_date = Utilities.formatDate(new Date(), "GMT+2", "dd/MM/yyyy");
  var   url4 = "https://cloudasset.googleapis.com/v1/organizations/"+org_id+"/:searchAllResources?assetTypes=container.googleapis.com/Cluster&readMask=displayName,parentFullResourceName,createTime,labels,state";

     const payload = {
      method: "GET",
      contentType: 'application/json',
      muteHttpExceptions: true,
      requestedPolicyVersion: 3,
      headers: {
      Authorization: 'Bearer ' + getAccessToken()
       }
     }
  wynik.push(["Name", "ID", "Lables", "State", "Creation Time", "Scan Time", "Priority (0-high...100-low)"])
  do {
   if (pageToken != 0){
       url4 = url4 + "&pageToken=" + pageToken;
     }
    var resultX = JSON.parse(UrlFetchApp.fetch(url4,payload).getContentText());
    var resultX2 = resultX.results;
    for(var zmienna_0 = 0; zmienna_0<resultX2.length; zmienna_0++){
      var minBoundary2 = "projects/";
      var min2 = resultX2[zmienna_0].parentFullResourceName.indexOf(minBoundary2) + minBoundary2.length;
      var max2 = resultX2[zmienna_0].parentFullResourceName.length;
      var name2 = resultX2[zmienna_0].parentFullResourceName.substring(min2,max2);
      var env_data = "undefined"
       if(resultX2[zmienna_0].labels)
          {
            if(resultX2[zmienna_0].labels.environment)
              env_data = resultX2[zmienna_0].labels.environment; //label env
            if(resultX2[zmienna_0].labels.env)
              env_data = resultX2[zmienna_0].labels.env; //label env

          }
      //check duplicate names 
      //keep in mind that for example same cluster name in both region can have different workloads
      if(wynik.length == 0)
        wynik.push([resultX2[zmienna_0].displayName, name2, env_data, resultX2[zmienna_0].state, resultX2[zmienna_0].createTime, scan_date, "0"])
      else
        //check if already exist on list
        if(helper_find_same_record(wynik,name2) == 0)
          wynik.push([resultX2[zmienna_0].displayName, name2, env_data, resultX2[zmienna_0].state, resultX2[zmienna_0].createTime, scan_date, "0"])
    }
   pageToken = resultX.nextPageToken;
   } while(pageToken)
return wynik;
}

function helper_retrive_deployment_names(gke_cluster){
  var tabl_full = [];
  var handler01_0 = SpreadsheetApp.openById(Cache_DB);
  const new_date = new Date();
  var data_today = Utilities.formatDate(new_date, "GMT+2", "dd/MM/yyyy");
  var tab_a = handler01_0.getSheetByName(gke_cluster);
  var values_a = tab_a.getDataRange().getValues();
  var count_apps = tab_a.getLastRow(); 
  for (var abc1 = 0; abc1<count_apps;abc1++){
      if(values_a[abc1][3] != "")
        {
         if((data_today == Utilities.formatDate(values_a[abc1][2], "GMT+2", "dd/MM/yyyy")))
         tabl_full.push(values_a[abc1][0])
        }
  }
  return tabl_full;
}

function helper_remove_duplicates(gke_cluster){
var no_duble_table = []

var source_list = open_spreadsheet_tab(Cache_DB, gke_cluster)

for (var zmienna = 0; zmienna<source_list.length ; zmienna++)
  {
    //Logger.log(source_list[zmienna][0])
    if (no_duble_table.length == 0){
      no_duble_table.push(source_list[zmienna])
      
      }
    else
    { 
      if(helper_compare_3_records(source_list[zmienna][0], source_list[zmienna][1], source_list[zmienna][2],no_duble_table) == 0)
       no_duble_table.push(source_list[zmienna])
    }
  }
  write_to_spreadsheet_tab(Cache_DB, gke_cluster, no_duble_table)
}

function helper_compare_3_records(param1, param2, param3, source_table){
  for (var zmienna=0;zmienna<source_table.length;zmienna++)
  {
    if(param1 == source_table[zmienna][0] && param2 == source_table[zmienna][1] && param3 == source_table[zmienna][2])
      return 1;
  }
 return 0;
}



function run_scheduled_scan_gke_asset_inventory(){

//sprawdz w jakiej kolejności robic update

var name_of_file_helper = SpreadsheetApp.openById(Cache_DB);
var name_of_tab_helper = name_of_file_helper.getSheetByName("GKE_CLUSTERS"); 
var sorted_tab = name_of_tab_helper.sort(7, false)
var load_sorted_tab = sorted_tab.getDataRange().getValues();

var order_clusters = [];

 for (var counter_00 = 1; counter_00<load_sorted_tab.length; counter_00++){

  //if there is no date then add tab to review
   if(load_sorted_tab[counter_00][7] == '' || load_sorted_tab[counter_00][7] == null ) 
   {
    order_clusters.push([load_sorted_tab[counter_00][1]])
    break
   }
   else
    if(Utilities.formatDate(load_sorted_tab[counter_00][7], "GMT+2", "dd/MM/yyyy") != Utilities.formatDate(new Date(), "GMT+2", "dd/MM/yyyy").toString())
     {
      order_clusters.push([load_sorted_tab[counter_00][1]])
     }
 }


 //enumration of tabs with cluster names //order_clusters.length
 for(var counter_01 = 0; counter_01<order_clusters.length; counter_01++){

   var cache_db_inventory_file = open_spreadsheet_tab(Cache_DB, order_clusters[counter_01] )

    //enumeration of all entries from cluster tab
    for(var counter_02 = 0; counter_02 < cache_db_inventory_file.length; counter_02++){

    var pod_name = cache_db_inventory_file[counter_02][0].toString();
    var namespace_name = cache_db_inventory_file[counter_02][1].toString();
    var date_of_scan = cache_db_inventory_file[counter_02][2];
    var label_product_name = cache_db_inventory_file[counter_02][4].toString();
    var project__name = cache_db_inventory_file[counter_02][3].toString();


    //var inventory_db_file = open_spreadsheet_tab(Inventory_DB,"GKE_ASSETS")

    var inventory_db_file = SpreadsheetApp.openById(Inventory_DB);
    var inventory_db_file_tab = inventory_db_file.getSheetByName("GKE_ASSETS");
    var inventory_db_file_tab_data = inventory_db_file_tab.getDataRange().getValues();
    Logger.log("wczytuje jeszcze raz Inventory_DB")
    Logger.log(inventory_db_file_tab_data.length)
    var flag_update_only = 0;


     for (var counter_03 = 0; counter_03< inventory_db_file_tab_data.length; counter_03++){

      var pod_name_1 = inventory_db_file_tab_data[counter_03][0];

      if(pod_name == pod_name_1)
      {
        flag_update_only=1;
        break;
      }


     }
      if(flag_update_only==0){
      inventory_db_file_tab.appendRow([pod_name,,project__name,date_of_scan,namespace_name,label_product_name]); 
      }

      if(flag_update_only==1){
      inventory_db_file_tab.getRange((counter_03+1),4).setValue(date_of_scan) 
      inventory_db_file_tab.getRange((counter_03+1),3).setValue(project__name)
      inventory_db_file_tab.getRange((counter_03+1),5).setValue(namespace_name)
      inventory_db_file_tab.getRange((counter_03+1),6).setValue(label_product_name)
      }



    }
    //var temp_app = temp_file_memory[counter_new_apps][1].toString();




  //Logger.log(cache_db_inventory_file);

 // Logger.log("tab %s done",order_clusters[counter_01])
  mark_as_processed(order_clusters[counter_01]);

 }


}


//function which mark tab (in cache_db file) as processed
function mark_as_processed(tab_name_env){

var name_of_file_helper_ = SpreadsheetApp.openById(Cache_DB);
var name_of_tab_helper_ = name_of_file_helper_.getSheetByName("GKE_CLUSTERS"); 
var values_of_tab_helper_ = name_of_tab_helper_.getDataRange().getValues();
for (var counter_ = 0; counter_< values_of_tab_helper_.length; counter_++)
{
  if(values_of_tab_helper_[counter_][1] == tab_name_env)
  {
      name_of_tab_helper_.getRange((counter_+1),8).setValue(new Date());
  }

}




}



