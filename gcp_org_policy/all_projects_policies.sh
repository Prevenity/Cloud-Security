#!/bin/bash
#mb2023

ORG_ID=$(gcloud organizations list --format 'value(ID)')

for project in $(gcloud asset search-all-resources --scope organizations/$ORG_ID --asset-types='cloudresourcemanager.googleapis.com/Project' --format='value(name.basename())')
    do
        echo "Org policies for $project"
        for constraint in $(gcloud resource-manager org-policies list --project=$project  --format='value(constraint.basename())') 
        do
            gcloud alpha resource-manager org-policies describe $constraint --project=$project --effective
        done
        echo "------"
    done
