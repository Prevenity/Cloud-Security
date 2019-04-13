#!/bin/bash
#mariusz.burdach 2018

display() {
 echo
 echo " -u, --user provide username for example -u accountname"
}

enumerate() {
echo "Enumerating all roles for user: $1"
#enumerate projects and
for project in $(gcloud projects list --format="value(projectId)")
do
  echo "+++++++++++++++++++++ Project ID $project:"
  for test2 in $(gcloud projects get-iam-policy $project --flatten="bindings[].members" --format="value(bindings.role)" --filter="bindings.members:$1")
    do
        if [ -z "$test2" ]
        then
        echo "  no roles"
        else
        echo "  $test2"
        fi
    done
done

}

if [[ -z $1 ]] ; then
   display
else
 case $1 in
   -u|--user)
   enumerate $2
   ;;
   *)
   display
   ;;
 esac
fi

