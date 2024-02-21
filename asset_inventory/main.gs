const GCP_Org_ID = "000000" //GCP ORG ID
const GSUITE_Org_ID = "0000000"
const Cache_DB = "" //id of gsuite spreadsheet
const Inventory_DB = "" //id of second gsuite spreadsheet

const config_scope = ["COMPUTE_ENGINES"]
//possible scopes
//COMPUTE_ENGINES
//GKE_CLUSTERS
//DB_CLOUDSQL, DB_BQ, DB_BT, DB_FIREBASE (not ready)
//BUCKETS (not ready)
//PROJECTS (not ready)


//create new tab or clean existing tab
function setup_cache_db(){

  //clean_spreadsheet(Cache_DB)

 if(!config_scope.length)
  Logger.log("config_scope is EMPTY")

 for (var counter = 0; counter < config_scope.length; counter++)
  {
    if(config_scope[counter] == "COMPUTE_ENGINES") {
     prepare_spreadsheet_tab(Cache_DB,config_scope[counter])

    }
    if(config_scope[counter] == "GKE_CLUSTERS") {
      //create or reset tab
      prepare_spreadsheet_tab(Cache_DB,config_scope[counter])
      //enumerate gke clusters
      var gke_cluster_list = list_gke_clusters(GCP_Org_ID)
      //write list of gke clusters to tab
      write_to_spreadsheet_tab(Cache_DB,config_scope[counter],gke_cluster_list);
      //create empty tab names of RUNNING clusters
       for (var zmienna = 0; zmienna<gke_cluster_list.length; zmienna++)
        {
          if(gke_cluster_list[zmienna][3] == "RUNNING")
            prepare_spreadsheet_tab(Cache_DB,gke_cluster_list[zmienna][1])
        }
     }

  }

}

function run_asset_inventory(){

 if(!config_scope.length)
  Logger.log("config_scope is EMPTY")

for (var counter = 0; counter < config_scope.length; counter++)
  {


   if(config_scope[counter] == "GKE_CLUSTERS") {
    gke_inventory_main()
    }

  if(config_scope[counter] == "COMPUTE_ENGINES") {
    vms_inventory_main()
   }

  }


}




function setup_inventory_db(){

  clean_spreadsheet(Inventory_DB)
  let columnA = "System name (updated automatically)"
  let columnB = "System description (updated by owner)"
  let columnC = "Environment (updated automatically)" 
  let columnD = "Last update (updated automatically)" 
  let columnE = "Namespace (updated automatically)" 
  let columnF = "Label - Product (updated automatically)" 
  let columnG = "Asset Owner (updated automatically)" 
  let columnH = "Confidentiality (updated by owner)"
  let columnI = "Integrity (updated by owner)"
  let columnJ = "Availability (updated by owner)"
  let columnK = "Criticality (updated automatically)"
  let columnL = "Internal / External (updated by owner)"
  let columnM = "Process personal data? (updated by owner)"
  let columnN = "Class of information (updated by owner)"
  let columnO = "VM (OS name)"
  let columnP = "VM (interal IP)"
  let columnQ = "VM (external IP)"
  

var asset_header = [
  [columnA,columnB,columnC,columnD,columnE,columnF,columnG,columnH,columnI,columnJ,columnK,columnL,columnM,columnN,columnO,columnP,columnQ]
];

if(!config_scope.length)
  Logger.log("config_scope is EMPTY")


for(var counter = 0; counter<config_scope.length;counter++){

 
  if(config_scope[counter] == "GKE_CLUSTERS") {

  prepare_spreadsheet_tab(Inventory_DB, "GKE_ASSETS")
  write_to_spreadsheet_tab(Inventory_DB, "GKE_ASSETS", asset_header)
  helper_change_background_color(Inventory_DB, "GKE_ASSETS")
  }

  if(config_scope[counter] == "COMPUTE_ENGINES") {

  prepare_spreadsheet_tab(Inventory_DB, "COMPUTE_ENGINES")
  write_to_spreadsheet_tab(Inventory_DB, "COMPUTE_ENGINES", asset_header)
  helper_change_background_color(Inventory_DB, "COMPUTE_ENGINES")
  }

} 


}

