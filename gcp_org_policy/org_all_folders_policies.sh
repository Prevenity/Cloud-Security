#!/bin/bash
#mb2023

ORG_ID=$(gcloud organizations list --format 'value(ID)')
echo "$ORG_ID"

for constraint in $(gcloud resource-manager org-policies list --organization $ORG_ID --format='value(constraint.basename())') 
  do
     gcloud  resource-manager org-policies describe $constraint --organization $ORG_ID
  done

list_subfolders() {

  local parent_folder=$1
  local folders

  # List folders directly under the parent folder
  folders=$(gcloud resource-manager folders list --folder="$parent_folder" --format="value(name)")
  for folder in $folders; do
    TARGET_FOLDERS+="$folder;"
    # Recursively list subfolders
    list_subfolders "$folder"
  done
}

folders_id+=$(gcloud resource-manager folders list --organization=$ORG_ID --format="value(name)")

 for folderx in $folders_id; do
  TARGET_FOLDERS+="$folderx;"
  list_subfolders "$folderx"
 done

delimeter=";"
values_final=()
IFS="$delimeter"
read -ra values_final <<< "$TARGET_FOLDERS"

for folder in ${values_final[@]}; do
    FOLDER=$folder
    echo "Org policies for $FOLDER"
    for constraint in $(gcloud resource-manager org-policies list --folder=$FOLDER  --format='value(constraint.basename())')
    do
        gcloud  resource-manager org-policies describe $constraint --folder=$FOLDER
    done
    echo "--------"
done
