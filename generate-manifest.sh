#!/bin/zsh

# Script to generate the media manifest.json file
# Run this script after adding or removing files from the media folder

MEDIA_DIR="media"
MANIFEST_FILE="$MEDIA_DIR/manifest.json"

# Supported extensions (images and videos)
EXTENSIONS="jpg|jpeg|png|gif|webp|mp4|webm|mov"

# Generate the manifest
echo "[" > "$MANIFEST_FILE"

first=true
for file in "$MEDIA_DIR"/*; do
    filename=$(basename "$file")
    # Skip manifest.json itself and check for valid extensions
    if [[ "$filename" != "manifest.json" && "$filename" =~ \.($EXTENSIONS)$ ]]; then
        if [ "$first" = true ]; then
            first=false
        else
            echo "," >> "$MANIFEST_FILE"
        fi
        printf '    "%s"' "$filename" >> "$MANIFEST_FILE"
    fi
done

echo "" >> "$MANIFEST_FILE"
echo "]" >> "$MANIFEST_FILE"

echo "✅ Manifest generated at $MANIFEST_FILE"
cat "$MANIFEST_FILE"
