set quiet

# Port configuration: override via environment variables or .env file
port := env("AEM_PORT", "3000")
studio_port := env("STUDIO_PORT", "3100")
wc_port := env("WC_PORT", "3200")

default:
    @just --list

install:
    cd web-components && npm install
    cd studio && npm install
    test -d io/www && cd io/www && npm install || true

start:
    cd studio && PORT={{studio_port}} node ./proxy-server.mjs https://author-p22655-e59433.adobeaemcloud.com &
    cd web-components && DEV_SERVER_PORT={{wc_port}} node ./watch.mjs --serve &
    aem up --port {{port}} &

stop:
    -lsof -ti:{{port}} | xargs kill -9 2>/dev/null
    -lsof -ti:{{studio_port}} | xargs kill -9 2>/dev/null
    -lsof -ti:{{wc_port}} | xargs kill -9 2>/dev/null

health:
    @curl -sf http://localhost:{{port}} > /dev/null 2>&1 && echo "AEM: UP ({{port}})" || echo "AEM: DOWN ({{port}})"
    @curl -sf http://localhost:{{studio_port}} > /dev/null 2>&1 && echo "Studio: UP ({{studio_port}})" || echo "Studio: DOWN ({{studio_port}})"
    @curl -sf http://localhost:{{wc_port}} > /dev/null 2>&1 && echo "WC: UP ({{wc_port}})" || echo "WC: DOWN ({{wc_port}})"

test:
    cd web-components && npm run test:ci
    cd studio && npm run test:ci

lint:
    cd web-components && npm run lint
