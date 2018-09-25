function start()
{
var drives2 = enum_team_drives_restrictions();
  
  for(o=0;o< drives2.length; o++)
  {
    abc2(drives2[o]);
  }
  
}


function abc2(teamDriveId)
{

  var cba = Drive.Teamdrives.get(teamDriveId, {useDomainAdminAccess: true});
  Logger.log(cba.name);
  Logger.log(cba.id);
  
}



function enum_team_drives_restrictions() {
  var pageToken, page;
  var lista = [];

  do {
 var params = {
    pageToken: pageToken,
    maxResults: 10,
   useDomainAdminAccess: true,
   };
 page = Drive.Teamdrives.list(params);
    var items2 = page.items;
  var counter = items2.length;

  for (i = 0; i< counter; i++)
  {
        
    var teamdrive = Drive.Teamdrives.get(items2[i].id, {useDomainAdminAccess: true, fields:'id, name, restrictions',});
       lista.push(items2[i].id); //list of teamdrive IDs
    
       }
  pageToken = page.nextPageToken;
  } while (pageToken);
  
  Logger.log(lista);
  Logger.log("Number of all team drives is %s",lista.length);
  return lista;
}




