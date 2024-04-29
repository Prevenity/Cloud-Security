#!/bin/sh
#MB2024

current_date=$(date +"%Y-%m-%d")
file_name="_list_of_vms_and_vulns.csv"
file_name_errors="_list_of_vms_without_osconfig.csv"

handle_error(){
	echo "error"
	echo "$vm_name,$vm_project" >> "${current_date}${file_name_errors}"
}

trap 'handle_error' ERR

while IFS= read -r line; do
#	echo "$line"
	vm_name=$(echo "$line" | awk '{print $1}')
	vm_id=$(echo "$line" | awk '{print $2}') 
	vm_location=$(echo "$line" | awk '{print $3}') 
	vm_project_long=$(echo "$line" | awk '{print $4}') 
	
	vm_project="${vm_project_long##*/}"
	
	echo "$vm_name $vm_project"

        DETAILS=$(gcloud compute os-config vulnerability-reports describe "$vm_name" --location="$vm_location" --project="$vm_project" --flatten="vulnerabilities[]" --format="csv[no-heading](vulnerabilities.details.cve,vulnerabilities.details.severity,vulnerabilities.details.cvssV3.baseScore,vulnerabilities.createTime,vulnerabilities.updateTime,vulnerabilities.details.cvssV3.attackVector,vulnerabilities.details.cvssV3.attackComplexity,vulnerabilities.details.cvssV3.privilegesRequired,vulnerabilities.details.references.url,vulnerabilities.installedInventoryItemIds,vulnerabilities.items[0].upstreamFix)")
    if [ ! -z "$DETAILS" ]; then
    
    while IFS= read -r line3; do
	 FINAL3="$vm_name,$vm_project,$line3"
        echo "$FINAL3" >> "${current_date}${file_name}" 
    done <<< "$DETAILS"

    fi


done < all_vms.txt
rm current_vms_with_vulns.csv
cp "${current_date}${file_name}" current_vms_with_vulns.csv
