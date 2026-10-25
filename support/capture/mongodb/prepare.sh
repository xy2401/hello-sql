#!/usr/bin/env bash
# Sourced once by the case runner; EXIT cleanup belongs to the same Bash process.
set -Eeuo pipefail
export HOME=/capture/work
export PATH="/opt/mongodb/bin:/opt/mongosh/bin:/opt/database-tools/bin:$PATH"
mkdir -p /capture/work/db
mongod --dbpath /capture/work/db --logpath /capture/work/mongod.log \
  --bind_ip 127.0.0.1 --port 27017 &
mongo_pid=$!
cleanup_mongodb() {
  local status=$?
  trap - EXIT INT TERM
  kill -TERM "$mongo_pid" 2>/dev/null || true
  wait "$mongo_pid" 2>/dev/null || true
  exit "$status"
}
trap cleanup_mongodb EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
ready=0
for ((i=0; i<60; i++)); do
  if mongosh --quiet --eval 'quit(db.runCommand({ping:1}).ok === 1 ? 0 : 1)' \
    > /capture/work/mongo-ready.stdout 2> /capture/work/mongo-ready.stderr; then
    ready=1
    break
  fi
  kill -0 "$mongo_pid"
  sleep 1
done
if [[ "$ready" != 1 ]]; then
  cat /capture/work/mongod.log >&2
  printf '%s\n' 'MongoDB did not become ready within 60 attempts' >&2
  exit 1
fi
mongosh --quiet capture --eval 'db.seed.drop(); db.seed.insertMany([{_id:1,name:"alpha",score:10},{_id:2,name:"beta",score:20},{_id:3,name:"gamma",score:30}])'

