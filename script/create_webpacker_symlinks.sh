#!/bin/bash

engine_webpack_entry_path="app/javascripts/packs/gencat.js"
engine_webpack_source_path="app/javascripts/gencat"

echo "Running webpacker setup"

while getopts “:d” opt; do
  case $opt in
    d) opt_dir=$OPTARG ;;
  esac
done
dev_dir=${opt_dir:-$DEV_DIR}

if [ -z "$dev_dir" ]
then
  echo "Please set DEV_DIR in your .bash_profile before running this script or invoke it with -d dev_dir, where dev_dir is the path containing gobierto";
else
  engines_path=${GOBIERTO_ENGINES_PATH:-"$DEV_DIR/gobierto/vendor/gobierto_engines"}
  source_path=$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )

  # This configuration is taken from gobierto/config/webpacker.yml
  gobierto_webpack_source_path="$dev_dir/gobierto/app/javascript"
  gobierto_webpack_entry_path="$gobierto_webpack_source_path/packs"

  echo "    Creating webpacker symlinks..."

  echo "    executing ln -s $source_path/$engine_webpack_entry_path $gobierto_webpack_entry_path"
  ln -s $source_path/$engine_webpack_entry_path $gobierto_webpack_entry_path

  echo "    executing ln -s $source_path/$engine_webpack_source_path $gobierto_webpack_source_path"
  ln -s $source_path/$engine_webpack_source_path $gobierto_webpack_source_path

  echo "    [OK]"
fi
