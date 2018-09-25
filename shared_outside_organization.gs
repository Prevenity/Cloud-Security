 function enumerate_all_files(teamDriveId) {
    var pageToken, result, files;
    var test = 0;
    var domain = 'domain.com';  //domain name
    var allPermitedDomains = ["domain.com"]; //list of trusted domains
  
    do {
      var params = {
        corpora: 'teamDrive',
        pageToken: pageToken,
        maxResults: 10,
        useDomainAdminAccess: true,
        supportsTeamDrives: true,
        includeTeamDriveItems: true,
        teamDriveId: teamDriveId,
      }
      
    result = Drive.Files.list(params); //enumeration of all files on team drives

    files = result.items;

    
      for(i = 0; i < files.length; i++){
        
      
        Logger.log("File name: %s", files[i].title);  
        Logger.log("link %s", files[i].embedLink);
        Logger.log("mimie %s", files[i].mimeType);
        Logger.log("sharedUser %s", files[i].sharingUser);
       
       
        
        if(files[i].mimeType == "application/vnd.google-apps.folder")
        {
          Logger.log("folders have no share feature :(");
          //just folder 
        }
        
     
        var perms = Drive.Permissions.list(files[i].id, {supportsTeamDrives: true}); //optional filed supportsTeamDrieves is key. we enumerate all permissions for file id.
        var perms_items = perms.items;
        for(j = 0; j < perms_items.length; j++){
          
          if (perms_items[j].type == 'domain')
          {
            //Logger.log("Uprawnienia @%s %s %s", perms_items[j].domain, perms_items[j].role, perms_items[j].type);
          }
          else
          {
            //Logger.log("Uprawnienia %s %s %s", perms_items[j].emailAddress, perms_items[j].role, perms_items[j].type);
          }
          
         
           if (allPermitedDomains.indexOf(perms_items[j].domain) == -1)
           {
            Logger.log("Uprawnienia @%s %s %s", perms_items[j].domain, perms_items[j].role, perms_items[j].type, owner2);
          }
          
        }
      
 
      
        test= test+1;
        
    }
    pageToken = result.nextPageToken; 
    
    } while(pageToken);
    Logger.log('Total number of files per Team Drive: %s', test);
}

