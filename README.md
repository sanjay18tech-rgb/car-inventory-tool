## Car Inventory AI Assistant

## Project Overview
An AI-assisted workflow that turns noisy CSV exports of vehicle listings into structured, reviewable inventory records. Upload a CSV, let the Groq-powered parser suggest make/model/year/color/status, then review, tweak, and submit each row with keyboard-friendly navigation.

## Run Locally
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure your environment**
   - Copy `.env.example` to `.env` (create one if it does not exist).
   - Set `VITE_GROQ_API_KEY=<your_groq_key>` so `/src/services/ai.js` can call the Groq API.
3. **Start the dev server**
   ```bash
   npm run dev
   ```
   Vite will print the local URL (typically `http://localhost:5173`).

## Configure the AI API Key
1. Create a Groq account and generate a key with access to the `llama-3.1-8b-instant` model (or whichever model you configure in `src/services/ai.js`).
2. Store the key in `.env` as `VITE_GROQ_API_KEY=<your_key>`. Never commit this file.
3. Restart `npm run dev` so Vite re-reads the environment variable.
4. If you redeploy, make sure the hosting provider also has the same environment variable configured.

### Features
- **CSV ingest** via `Papa.parse` with automatic skipping of empty rows.
- **AI extraction** powered by Groq `llama-3.1-8b-instant`, enforcing JSON-only responses.
- **Human-in-the-loop** review panel with validation (year range, allowed statuses) and submit workflow.
- **Prompt customization** through the Configure AI modal so operators can steer the extraction rules per campaign.
- **Keyboard navigation** (← →) and status badges to keep large queues moving quickly.

### Tech Stack
- React 19 + Vite 7 + SWC
- TailwindCSS for layout/styling
- PapaParse for CSV handling
- Lucide icons
- Groq Chat Completions API

## Assumptions
- CSV files contain at least one column with enough textual context for the AI to infer make/model/year/status.
- Operators validate every row before submitting; there is no automatic “bulk accept”.
- A single Groq API key is sufficient for the expected traffic volume; throttle/queueing is not implemented.
- No backend persistence layer is included—accepted records are expected to be exported or integrated elsewhere.

## Deployed URL
- Public deployment: 'https://car-inventory-tool.vercel.app/'.

### Usage Flow
1. Prepare a `.csv` with each row describing a vehicle (columns/order do not matter; the raw row string is passed to the AI).
2. Launch the dev server and use the landing screen to upload the CSV.
3. The processing dashboard loads:
   - **Left panel** shows the raw row JSON plus navigation controls.
   - **Right panel** displays AI-suggested fields, editable inputs, and a submit button. Rows move from `pending → submitting → processed`.
4. Need different extraction rules? Open **Configure AI** (top-right) and edit the system prompt; the new prompt applies to subsequent AI calls.
5. Retry failed AI calls with the **Retry** button, or manually fill the form and submit.

### Project Structure (selected files)
```
src/
  App.jsx                # Entry: upload vs processing screens
  components/
    UploadScreen.jsx     # Landing/upload UI
    ProcessingScreen.jsx # Orchestrates left/right panels & modal
    LeftPanel.jsx        # Raw row viewer + navigation
    RightPanel.jsx       # Handles AI fetch, form state, submission
    ConfigureAIModal.jsx # Prompt editor persisted in state
  services/
    ai.js                # Groq API client + JSON safety checks
public/
  vite.svg               # Static assets served by Vite
```

### Available Scripts
- `npm run dev` – Vite dev server with hot reload.
- `npm run build` – Production build into `dist/`.
- `npm run preview` – Preview the production bundle.
- `npm run lint` – ESLint (React, Hooks, Refresh plugins).

### Environment & Security Notes
- Never commit `.env` files; they contain your Groq key.
- Groq API calls run client-side; rotate keys regularly or proxy through a backend if stricter security is required.
- The form limits `year` to `1900…currentYear` and status to `New | Used | CPO` by default, but you can extend these options.

### Sample Data
A sample `car_listings.csv` is included at the repo root so you can try the flow immediately. Feel free to replace it with real dealership exports.

---

Questions or ideas? Open an issue or reach out to the team!

