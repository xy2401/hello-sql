#!/usr/bin/env bash
set -Eeuo pipefail
recipe=${1:?Pass the MongoDB recipe JSON}
export DEBIAN_FRONTEND=noninteractive
mapfile -t packages < <(jq -r '.dependencies.packages[]' "$recipe")
evidence=/usr/local/share/hello-capture/mongodb
mkdir -p "$evidence"
cp "$recipe" "$evidence/recipe.json"
apt-get update
# Save the repository resolution and downloaded bytes before apt's cleanup hooks.
apt-get clean
apt-get --print-uris -o Acquire::ForceHash=SHA256 -y --no-install-recommends \
  install "${packages[@]}" > "$evidence/dependencies.uris.txt"
apt-get -y --download-only --no-install-recommends install "${packages[@]}"
awk '$1 ~ /^\047/ && $4 ~ /^SHA256:/ { sub(/^SHA256:/, "", $4); print $4 "  " $2 }' \
  "$evidence/dependencies.uris.txt" > "$evidence/dependencies.expected.sha256"
(
  cd /var/cache/apt/archives
  find . -maxdepth 1 -type f -name '*.deb' -print0 | sort -z | xargs -0 -r sha256sum \
    > "$evidence/dependencies.sha256"
  [[ $(wc -l < "$evidence/dependencies.sha256") -eq $(wc -l < "$evidence/dependencies.expected.sha256") ]] \
    || { printf '%s\n' 'Dependency download list does not match recorded SHA-256 sources' >&2; exit 1; }
  if [[ -s "$evidence/dependencies.expected.sha256" ]]; then
    sha256sum --check --strict "$evidence/dependencies.expected.sha256"
  fi
)
apt-get -y --no-download --no-install-recommends install "${packages[@]}"
dpkg-query -W -f='${binary:Package}\t${Version}\t${Architecture}\n' > "$evidence/packages.tsv"
apt-get clean
downloads=$(mktemp -d)
trap 'rm -rf -- "$downloads"' EXIT
while IFS= read -r asset; do
  id=$(jq -r '.id' <<< "$asset")
  url=$(jq -r '.url' <<< "$asset")
  sha=$(jq -r '.sha256' <<< "$asset")
  destination=$(jq -r '.destination' <<< "$asset")
  strip=$(jq -r '.strip' <<< "$asset")
  archive="$downloads/$id.tgz"
  curl --fail --location --retry 3 --output "$archive" "$url"
  printf '%s  %s\n' "$sha" "$archive" | sha256sum --check --strict
  tar -tzf "$archive" > "$evidence/$id.archive-files.txt"
  mkdir -p "$destination"
  tar -xzf "$archive" -C "$destination" --strip-components="$strip"
done < <(jq -c '.artifacts[]' "$recipe")
rm -rf /var/lib/apt/lists/*

