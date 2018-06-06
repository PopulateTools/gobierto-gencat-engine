#!/bin/bash

engine_name="gobierto-gencat-engine"

echo "Running setup script for $engine_name"

if [ -z "$DEV_DIR" ]
then
  echo "Please set DEV_DIR in your .bash_profile before running this script";
else
  echo "Using DEV_DIR: $DEV_DIR"
  echo "Using GOBIERTO_ENGINES_PATH: $GOBIERTO_ENGINES_PATH"
  engines_path=${GOBIERTO_ENGINES_PATH:-"$DEV_DIR/gobierto/vendor/gobierto_engines"}
  source_path=$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )

  echo "Creating symlinks..."
  echo executing "ln -s $source_path $engines_path"
  ln -s $source_path $engines_path

  echo "[OK]"
fi
