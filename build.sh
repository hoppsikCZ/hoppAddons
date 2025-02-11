#!/bin/bash

# Usage: ./zip_exclude.sh folder_name output.zip

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <folder_to_zip> <output_zip>"
    exit 1
fi

FOLDER_TO_ZIP="$1"
OUTPUT_ZIP="$2"
BUILDIGNORE_FILE=".buildignore"

# Check if the folder exists
if [ ! -d "$FOLDER_TO_ZIP" ]; then
    echo "Error: Folder '$FOLDER_TO_ZIP' does not exist."
    exit 1
fi

# Read .buildignore and format exclusions for zip
EXCLUDE_PATTERNS=()
if [ -f "$BUILDIGNORE_FILE" ]; then
    while IFS= read -r line || [ -n "$line" ]; do
        # Ignore comments and empty lines
        [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
        
        # Add exclusion pattern for zip
        EXCLUDE_PATTERNS+=("$FOLDER_TO_ZIP/$line" "$FOLDER_TO_ZIP/$line/*")
    done < "$BUILDIGNORE_FILE"
fi

# Create the zip archive excluding patterns
zip -r "$OUTPUT_ZIP" "$FOLDER_TO_ZIP" -x "${EXCLUDE_PATTERNS[@]}"

echo "Zipped '$FOLDER_TO_ZIP' into '$OUTPUT_ZIP', excluding files from '$BUILDIGNORE_FILE'."
