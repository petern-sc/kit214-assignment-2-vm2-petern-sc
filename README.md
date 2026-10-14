# KIT214 Assignment 2

## Getting started

Install dependencies and start the development server:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 26
sudo apt install -y libatomic1

npm install
npm run dev
```

The server listens on port `3000` by default. Set `PORT` to use a different
port. `GET /` returns a JSON hello-world response.

## Scripts

- `npm run dev` starts the server with TypeScript watch/reload tooling.
- `npm run build` compiles the application into `dist/`.
- `npm start` runs the compiled application.
- `npm test` runs the test suite.
