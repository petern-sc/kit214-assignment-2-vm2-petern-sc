# kit214-assignment-2-vm2-petern-sc

## VM setup

- install node26
- Run `npm ci` to install dependencies.
- Database setup is in `data/init.sql`.

### Environment configuration
- Copy `.env.example` to `.env` and update the values for the environment.

### HTTPS configuration

- Configured via express. When `APP_ENV=development` skips TLS setup for local dev. Setting APP_ENV to anything else will run express with https.
- Requires `TLS_CERT_PATH` and `TLS_KEY_PATH` to be set. This is pointing to a self signed certificate on the VMs

### Running

- `npm run dev` runs the TypeScript source directly and restarts the server when source files change; no build is needed.
- `npm run build` compiles the source into `dist/`.
- `npm start` runs the compiled `dist/server.js`, so rebuild after changing source before using it.
- `npm run generate:jwt-secrets` generate JWT signing secret

## References

See VM3 Repo for main documentation.