#!/bin/bash

engine_name="gobierto-gencat-engine"
engine_webpack_entry_path="app/javascripts/packs/gencat.js"
engine_webpack_source_path="app/javascripts/gencat"

echo "Running setup script for $engine_name"

if [ -z "$DEV_DIR" ]
then
  echo "Please set DEV_DIR in your .bash_profile before running this script";
else
  engines_path=${GOBIERTO_ENGINES_PATH:-"$DEV_DIR/gobierto/vendor/gobierto_engines"}
  source_path=$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )
  echo "Using DEV_DIR: $DEV_DIR"
  echo "Using engines_path: $engines_path"

  echo "Creating symlinks..."
  echo executing "ln -s $source_path $engines_path"
  ln -s $source_path $engines_path

  # This configuration is taken from gobierto/config/webpacker.yml
  gobierto_webpack_source_path="$DEV_DIR/gobierto/app/javascript"
  gobierto_webpack_entry_path="$gobierto_webpack_source_path/packs"

  webpack_path="$DEV_DIR/gobierto/app/javascript"

  echo "Adding webpack symlinks..."
  echo executing "ln -s $source_path/$engine_webpack_entry_path $gobierto_webpack_entry_path/"
  ln -s $source_path/$engine_webpack_entry_path $gobierto_webpack_entry_path/

  echo executing "ln -s $source_path/$engine_webpack_source_path $gobierto_webpack_source_path/"
  ln -s $source_path/$engine_webpack_source_path $gobierto_webpack_source_path/

  echo "[OK]"
fi
