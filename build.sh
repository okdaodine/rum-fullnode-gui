set -e

yarn install && yarn build
docker build -t rum-fullnode-gui .