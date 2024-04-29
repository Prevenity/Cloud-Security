#!/bin/sh
#MB2024

current_date=$(date +"%Y-%m-%d")
file_name="_vulns_with_fixes"

while IFS= read -r line; do
#       echo "$line"
        fix=$(echo "$line" | cut -d ',' -f 13)
    if [ ! -z "$fix" ]; then
	echo "$line" >> "${current_date}${file_name}"
    fi


done < $1
rm current_vulns_with_fixes.csv
cp "${current_date}${file_name}" current_vulns_with_fixes.csv
