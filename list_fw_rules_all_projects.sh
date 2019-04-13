#!/bin/bash
#mb
for project in $(gcloud projects list --format="value(projectId)")
do
  echo "+++++++++++++++++++ProjectID: $project ++++++++++++++++++"
  echo " $(gcloud compute firewall-rules list --project $project --format="table(name, network, direction, sourceRanges.list(), allowed[].map().firewall_rule().list(), disabled)")"
  echo " "
done
#print number of projects


