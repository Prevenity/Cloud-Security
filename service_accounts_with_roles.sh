#!/bin/bash
#mb
#arr=()
#store projectid in table
for project in $(gcloud projects list --format="value(projectId)")
do
  #arr+=($project)
  echo "+++++++ Project ID $project:"
  for test1 in $(gcloud iam service-accounts list --project $project --format="value(email)") 
    do
     echo "Service account $test1 has roles: "
     for test2 in $(gcloud projects get-iam-policy $project --flatten="bindings[].members" --format="value(bindings.role)" --filter="bindings.members:$test1")
      do
        if [ -z "$test2" ]
        then
        echo "  no roles"
        else
        echo "  $test2"
        fi
      done
    done
	
done
#print number of projects
#echo "Number of projects ${#arr[@]}"
#store number of projects in file
#printf "%s\n" "${arr[@]}" > project_list.txt

#for i in "${arr[@]}"
#do
#echo $i
#done 
