#!/usr/bin/env bash
set -Eeuo pipefail
here=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
ENGINE=${ENGINE:-podman}
case "$ENGINE" in podman|docker) ;; *) printf 'Unsupported engine: %s\n' "$ENGINE" >&2; exit 2 ;; esac
: "${BASE_IMAGE:?Set BASE_IMAGE to the already built common Ubuntu image}"
export MONGODB_IMAGE=${MONGODB_IMAGE:-localhost/hello-capture/mongodb:9.0.4}
export PODMAN_COMPOSE_PROVIDER=${PODMAN_COMPOSE_PROVIDER:-podman-compose}
export BUILDAH_FORMAT=docker
export BASE_IMAGE
record=${BUILD_OUTPUT_DIR:-"$here/.local/builds/$(date -u +%Y%m%dT%H%M%SZ)-$$"}
[[ ! -e "$record" ]] || { printf 'Use a new build evidence directory: %s\n' "$record" >&2; exit 2; }
mkdir -p "$record"
record=$(cd -- "$record" && pwd)
printf 'running\n' > "$record/status.txt"
trap 'result=$?; if ((result != 0)); then printf "failed (%s)\n" "$result" > "$record/status.txt"; fi' EXIT
"$ENGINE" image inspect "$BASE_IMAGE" > "$record/ubuntu.inspect.json"
BASE_IMAGE=$(node -e 'const image=JSON.parse(require("fs").readFileSync(process.argv[1]))[0]; const id=image.Id ?? image.ID; if (!/^(sha256:)?[a-f0-9]{64}$/.test(id)) throw new Error("Invalid Ubuntu image identity"); console.log(id)' "$record/ubuntu.inspect.json")
"$ENGINE" compose version > "$record/compose-version.txt" 2>&1
"$ENGINE" compose -f "$here/compose.yaml" config > "$record/compose.yaml"
"$ENGINE" compose -f "$here/compose.yaml" build mongodb 2>&1 | tee "$record/build.log"
"$ENGINE" image inspect "$MONGODB_IMAGE" > "$record/mongodb.inspect.json"
node --input-type=module - "$record" "$ENGINE" "$BASE_IMAGE" "$MONGODB_IMAGE" "$here/recipe.json" <<'NODE'
import fs from 'node:fs';
import crypto from 'node:crypto';
const [dir, engine, base, product, recipe] = process.argv.slice(2);
const stages = [['ubuntu', base], ['mongodb', product]].map(([id, reference]) => {
  const [image] = JSON.parse(fs.readFileSync(`${dir}/${id}.inspect.json`, 'utf8'));
  return { id, reference, image: image.Id ?? image.ID };
});
if (stages.some(stage => !stage.image)) throw new Error('Image inspection did not return an immutable ID');
fs.writeFileSync(`${dir}/images.json`, JSON.stringify({ schemaVersion: 1, engine, createdAt: new Date().toISOString(), recipeSha256: crypto.createHash('sha256').update(fs.readFileSync(recipe)).digest('hex'), stages }, null, 2) + '\n');
NODE
printf 'complete\n' > "$record/status.txt"
printf '\nBUILD_RECORD=%s/images.json\n' "$record"

