#!/bin/bash
#mb
for project in $(gcloud projects list --format="value(projectId)")
do
  echo "+++++++++++++++++++ProjectID: $project ++++++++++++++++++"
  echo " $(gcloud --format="value(networkInterfaces[0].accessConfigs[0].natIP)" compute instances list --project $project)"
  echo " "
done
#print number of projects


