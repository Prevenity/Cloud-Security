#!/bin/bash
#mariusz.burdach 2018
echo "Enumerating all users for role: $1"
#enumerate projects and 
for project in $(gcloud projects list --format="value(projectId)")
do
  echo "+++++++++++++++++++++ Project ID $project:"
  for test2 in $(gcloud projects get-iam-policy $project --flatten="bindings[].members" --format="value(bindings.members)" --filter="bindings.role:$1")
    do
	if [ -z "$test2" ]
	then
 	echo "	no users"
	else
	echo "  $test2"
	fi
    done
done


