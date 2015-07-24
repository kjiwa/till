#!/usr/bin/env bash

# A script that runs the server binary. A virtualenv environment is created for
# dependencies.

source third_party/shflags.sh

DEFINE_boolean clean ${FLAGS_FALSE} "Clean the directory of build artifacts." c
DEFINE_string envname env "The virtualenv environment to create." e
DEFINE_integer port 8080 "The port on which to serve requests." p

FLAGS $@ || exit $?
eval set -- ${FLAGS_ARGV}

set -e

[ ${FLAGS_help} -eq ${FLAGS_TRUE} ] && exit 0

# Cleans the directory of build artifacts.
function clean() {
  rm -rf ${FLAGS_envname}
}

# Creates a virtualenv environment and runs the output binary in it.
function run() {
  [ ! -d ${FLAGS_envname} ] && virtualenv ${FLAGS_envname}
  source ${FLAGS_envname}/bin/activate
  pip install -r requirements.txt
  gunicorn server:APP --bind 0.0.0.0:${FLAGS_port} --log-level DEBUG
  deactivate
}

if [ ${FLAGS_clean} -eq ${FLAGS_TRUE} ]; then
  clean
  exit
fi

run
