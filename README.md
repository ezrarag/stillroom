# Stillroom Music Inc.

Initial website for Stillroom Music Inc., a Milwaukee contemporary ensemble.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build creates a Cloudflare Worker-compatible Sites artifact under `dist/`.

## Integration Notes

This initial site does not need Firebase. There is no account system, saved user
state, uploaded files, or durable application data yet.

Stripe is not required for the first push. Add Stripe when Stillroom is ready to
accept online donations directly on the site. Until then, the donation call to
action prepares an email request for current donation instructions.
