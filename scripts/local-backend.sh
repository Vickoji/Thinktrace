#!/usr/bin/env bash
# Start a disposable development stack. Supabase captures local email in Mailpit.
set -euo pipefail
cd "$(dirname "$0")/.."
export SUPABASE_HOME="${SUPABASE_HOME:-${TMPDIR:-/tmp}/thinktrace-supabase}"
export SUPABASE_TELEMETRY_DISABLED=1
export SUPABASE_INTERNAL_IMAGE_REGISTRY="${SUPABASE_INTERNAL_IMAGE_REGISTRY:-ghcr.io}"
cli=./node_modules/.bin/supabase
network=thinktrace_local_services
gateway=thinktrace_local_gateway
network_flags=()

# Docker's client can inject its HTTP proxy into the local-only containers.
# In that mode BusyBox routes even its loopback health probes through the proxy.
# Isolate those services and forward only the API, database and test inbox to the host.
if docker network inspect "$network" >/dev/null 2>&1; then
  if [[ "$(docker network inspect --format '{{.Internal}}' "$network")" != true ]]; then
    echo "Expected $network to be an internal Docker network." >&2
    exit 1
  fi
  network_flags=(--network-id "$network")
fi
case "${1:-start}" in
  test) exec "$cli" test db --local "${network_flags[@]}" ;;
  stop)
    "$cli" stop "${network_flags[@]}"
    if docker inspect "$gateway" >/dev/null 2>&1; then docker stop "$gateway" >/dev/null; fi
    exit 0 ;;
  start) ;;
  *) echo "Usage: $0 [start|stop|test]" >&2; exit 2 ;;
esac

docker_settings="${DOCKER_CONFIG:-$HOME/.docker}"
# Both files are public static assets read through unprivileged container bind mounts.
chmod a+r supabase/templates/code.html scripts/local-gateway.conf
if [[ ${#network_flags[@]} -gt 0 ]] || python3 - "$docker_settings/config.json" <<'PY_PROXY'
import json, pathlib, sys
path = pathlib.Path(sys.argv[1])
settings = json.loads(path.read_text()) if path.is_file() else {}
sys.exit(0 if any(proxy.get("httpProxy") for proxy in settings.get("proxies", {}).values()) else 1)
PY_PROXY
then
  if [[ ${#network_flags[@]} -eq 0 ]]; then
    docker network create --internal "$network" >/dev/null
    network_flags=(--network-id "$network")
  fi
  if ! docker container inspect "$gateway" >/dev/null 2>&1; then
    docker create --name "$gateway" --network bridge \
      -p 127.0.0.1:54321:8000 -p 127.0.0.1:54322:5432 -p 127.0.0.1:54324:8025 \
      --mount "type=bind,src=$PWD/scripts/local-gateway.conf,dst=/tmp/thinktrace-nginx.conf,readonly" \
      --health-cmd 'wget -Y off -q -O /dev/null http://127.0.0.1:8000/auth/v1/health' \
      --health-interval 10s --health-start-period 90s \
      --entrypoint nginx ghcr.io/supabase/kong:2.8.1 \
      -p /tmp -c /tmp/thinktrace-nginx.conf -g 'daemon off;' >/dev/null
  fi
  if [[ "$(docker inspect -f '{{if index .NetworkSettings.Networks "thinktrace_local_services"}}yes{{end}}' "$gateway")" != yes ]]; then
    docker network connect "$network" "$gateway"
  fi
  docker start "$gateway" >/dev/null
  # Keep context and credential-helper discovery for public images. The daemon
  # retains its upstream proxy. Inline registry credentials stay in the original file.
  local_config=$(mktemp -d)
  trap 'rm -rf -- "$local_config"' EXIT
  python3 - "$docker_settings" "$local_config" <<'PY_LOCAL'
import json, os, pathlib, sys
source, target = map(pathlib.Path, sys.argv[1:])
contexts = source / "contexts"
if contexts.is_dir():
    (target / "contexts").symlink_to(contexts.resolve())
config = source / "config.json"
settings = json.loads(config.read_text()) if config.is_file() else {}
settings = {key: settings[key] for key in ("currentContext", "credsStore", "credHelpers") if key in settings}
with os.fdopen(os.open(target / "config.json", os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600), "w") as f:
    json.dump(settings, f)
PY_LOCAL
  export DOCKER_CONFIG="$local_config"
fi

"$cli" start "${network_flags[@]}" -x storage-api,imgproxy,realtime,studio,postgres-meta,edge-runtime,logflare,vector,supavisor >/dev/null
"$cli" migration up --local "${network_flags[@]}"
if [[ -e .env.local || -n "${SUPABASE_URL:-}" || -n "${SUPABASE_PUBLISHABLE_KEY:-}" ]]; then
  echo "Existing application configuration retained. Local Supabase is available on port 54321."
  exit 0
fi
# Keep the CLI's privileged status fields out of files, terminal output, and the application.
"$cli" status -o json | python3 -c '
import json, os, sys, tempfile
config = json.load(sys.stdin)
url = config["API_URL"]
key = config.get("PUBLISHABLE_KEY") or config["ANON_KEY"]
if not url.startswith("http://127.0.0.1:") or not key or "\n" in key:
    raise SystemExit("Local Supabase returned unexpected public configuration")
with tempfile.NamedTemporaryFile(mode="w", prefix=".env.local.", dir=".", delete=False) as tmp:
    try:
        tmp.write(f"SUPABASE_URL={url}\nSUPABASE_PUBLISHABLE_KEY={key}\n")
        tmp.flush()
        os.link(tmp.name, ".env.local")
    finally:
        os.unlink(tmp.name)
'
echo "Local Supabase is ready. Development mail is available at http://127.0.0.1:54324."
