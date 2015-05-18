#!/usr/bin/env bash

# A script to build an output binary. A virtualenv environment is created for
# dependencies. After the build a standalone executable will be produced.
#
# If any program arguments are specified (i.e. anything preceding the final --)
# then the output binary is executed within a virtualenv environment with those
# arguments.

source third_party/shflags.sh

DEFINE_boolean clean false "Clean the directory of build artifacts." c
DEFINE_string envname env "The virtualenv environment to create." e
DEFINE_string out till "The name of the output binary" o

FLAGS $@ || exit $?
eval set -- ${FLAGS_ARGV}

set -e

[ ${FLAGS_help} -eq ${FLAGS_TRUE} ] && exit 0

# Cleans the directory of build artifacts.
function clean() {
  rm -rf ${FLAGS_envname} ${FLAGS_out}
}

# Builds the output binary.
function build() {
  TMP_FILE=$(mktemp -u).zip
  zip ${TMP_FILE} *.py
  echo "#!/usr/bin/env python" | cat - ${TMP_FILE} > ${FLAGS_out}
  chmod +x ${FLAGS_out}
  rm ${TMP_FILE}
}

# Creates a virtualenv environment and Runs the output binary in it.
function run() {
  [ ! -d ${FLAGS_envname} ] && virtualenv ${FLAGS_envname}
  source ${FLAGS_envname}/bin/activate
  pip install bottle lxml python-gflags
  ./${FLAGS_out} $@
  deactivate
}

if [ ${FLAGS_clean} -eq ${FLAGS_TRUE} ]; then
  clean
  exit
fi

build
[ ${#@} -gt 0 ] && run $@
