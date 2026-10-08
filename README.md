<div align="center">

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>Built with AI Studio</h2>

  <p>The fastest path from prompt to production with Gemini.</p>

  <a href="https://aistudio.google.com/apps">Start building</a>

</div>

## AI Workers and customer image storage

- Part identification uses only `https://atlas-aishenasaei.javanwebio.workers.dev/v1/chat/completions`.
- Text chat and face-to-face conversations use only `https://atlasai.javanwebio.workers.dev/v1/chat/completions`.
- The Express server calls the Workers only; it does not call Gemini directly. Worker requests use `gemini-3.8-flash` first and retry with `gemini-3.7-flash` after a Worker/API error, within the same configured timeout. Gemini/API credentials remain in Cloudflare Worker Secrets; do not add them to this repository or the frontend.
- Customer images are validated and re-encoded as orientation-corrected JPEGs with metadata removed, then committed to `javanweb/imageatlas` under `uploads/YYYY/MM/<unique-id>-<safe-name>.jpg`. If the repository is genuinely empty, the first upload creates a root commit on `main`; subsequent uploads use the GitHub Contents API. The server verifies the public raw-image URL before sending it to the recognition Worker.
- The backend sends the Worker v4.1 contract as top-level `{image_url, file_name, prompt}`; no customer Base64/binary is sent to the Worker. The Worker key and both configured models passed `/v1/models` (HTTP 200). Earlier live checks confirmed the repository was empty and the server environment had no `IMAGEATLAS_GITHUB_TOKEN`; live GitHub upload, actual Gemini image inference, catalog matching, and product rendering therefore remain unverified until the deployment secret is configured.
- **A public URL avoids large app-to-Worker uploads, but the vision model still has to fetch and process the pixels. It cannot guarantee immunity from the model's own image limits or quotas.**
- **`javanweb/imageatlas` is public. Every uploaded image is publicly downloadable.** The upload screen warns customers not to submit faces, license plates, contact details, or confidential documents.

### Server secrets

Configure these as server-side environment variables in the hosting platform (never as `VITE_*` variables):

```text
IMAGEATLAS_GITHUB_TOKEN=<fine-grained GitHub token>
WORKER_AI_TIMEOUT_MS=60000
```

The GitHub token should be fine-grained and scoped only to the `javanweb/imageatlas` repository with **Contents: Read and write** permission. The app creates one commit per customer image. If the repository is empty, the first upload initializes `main` with that image; if the repository already has a different default branch, the app stops rather than creating a disconnected `main` branch.

### Cloud Run deployment

Deploy the repository using the included `Dockerfile`. It builds the Vite assets, compiles the Express server, runs the production entry point, and listens on Cloud Run's `PORT`; it does not start Vite's development server or expose an HMR socket. Configure `IMAGEATLAS_GITHUB_TOKEN` as a server-side Secret Manager environment variable, never as a build argument or frontend variable. API paths that do not exist return JSON rather than the SPA HTML shell.

### Android/native builds

Set the non-secret build variable `VITE_API_BASE_URL` to the deployed backend origin when building an Android APK. Leave it empty for the website, which calls the same-origin `/api` routes. Never put `IMAGEATLAS_GITHUB_TOKEN` or any AI credential in a `VITE_*` variable.
