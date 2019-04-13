#!/bin/bash
#mariusz.burdach 2019
prefix="roles/"
#gcloud projects get-iam-policy <proj> --format="table(bindings.role)"
for roles in $(gcloud iam roles list --format="value(name)")
do 
  rola=${roles#"$prefix"} 
  echo "+++++++++++++++++++++ Users with role: ${rola}"
  for project in $(gcloud projects list --format="value(projectId)")
   do
    echo "+++++++ Project ID $project:"
    for test2 in $(gcloud projects get-iam-policy $project --flatten="bindings[].members" --format="value(bindings.members)" --filter="bindings.role:${rola}")
      do
        if [ -z "$test2" ]
        then
        echo "  no users"
        else
        echo "  $test2 in Project ID: $project"
        fi
      done
   done
done






#gcloud projects get-iam-policy <proj> --flatten="bindings[].members" --format="table(bindings.members)" --filter="bindings.role:${arr[1]}"
