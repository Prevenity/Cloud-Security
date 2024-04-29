#!/bin/sh
#MB2024
# check ORGID

#ORG_ID=$(gcloud organizations list --format="value(name)")
ORG_ID=$1

ALL_VMS=$(gcloud asset search-all-resources --scope=organizations/$1 --asset-types=compute.googleapis.com/Instance --format="table(displayName,additionalAttributes.id,location,parentFullResourceName,additionalAttributes.osLongName,additionalAttributes.externalIPs,additionalAttributes.internalIPs)")
rm all_vms.txt
echo "$ALL_VMS" >> all_vms.txt



