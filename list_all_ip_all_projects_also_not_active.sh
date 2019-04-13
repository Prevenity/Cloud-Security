#!/bin/bash
#mb
for project in $(gcloud projects list --format="value(projectId)")
do
  echo "+++++++++++++++++++ProjectID: $project ++++++++++++++++++"
  echo " $(gcloud compute addresses list --project $project --format="value(address)")"
  echo " "
done
#print number of projects


