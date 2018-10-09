#!/bin/bash

engine_name="gobierto-gencat-engine"

echo "Running setup script for $engine_name"
while getopts “:d:” opt; do
  case $opt in
    d) opt_dir=$OPTARG ;;
  esac
done

gobierto_dir=${opt_dir:-"$DEV_DIR/gobierto"}

if [ -z "$gobierto_dir" ]
then
  echo "Please set DEV_DIR in your .bash_profile before running this script or invoke it with -d gobierto_dir, where gobierto_dir is the path of gobierto release";
else
  engines_path="$gobierto_dir/vendor/gobierto_engines"
  source_path=$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )
  echo "Using gobierto_dir: $gobierto_dir"
  echo "Using engines_path: $engines_path"

  echo "Creating symlinks..."
  echo "executing ln -s $source_path $engines_path"
  ln -s $source_path $engines_path

  #$source_path/script/create_webpacker_symlinks.sh -d $gobierto_dir

  echo "executing ln -s $source_path/node_modules $gobierto_dir"
  ln -s $source_path/node_modules $gobierto_dir

  echo "[OK]"
fi
