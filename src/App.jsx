import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// =============================================
// AI Stock Vault — Temporary Website (Single-File React App)
// ---------------------------------------------
// Purpose: A lightweight, host-anywhere demo site that matches your
// "AI One-Stop" brief: gallery, previews, credits, watch-ads-to-earn,
// and mocked checkout. You can deploy this as-is to Vercel/Netlify
// or export to a static page for GitHub Pages (via a bundler).
//
// Notes:
// - All data is mocked locally for quick demo.
// - Replace the MOCK_API calls with your backend endpoints later.
// - Uses Tailwind classes (framework injected by the preview runtime).
// - Clean, modern UI with dark mode toggle.
// =============================================

// -------------------------
// Mock Data & API Layer
// -------------------------
const MOCK_ASSETS = [
  {
    id: "vid_001",
    type: "video",
    title: "Cinematic Anime Loop — Forest Glow",
    tags: ["anime", "loop", "cinematic"],
    previewUrl:
      "https://cdn.coverr.co/videos/coverr-mystic-forest-5584/1080p.mp4?download=true",
    poster:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
    price: 49,
    credits: 49,
    duration: 12,
    attributes: { resolution: "1080p", license: "COMMERCIAL" },
  },
  {
    id: "img_101",
    type: "image",
    title: "Futuristic Cityscape — Neon Night",
    tags: ["image", "city", "neon"],
    previewUrl:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=600&auto=format&fit=crop",
    price: 19,
    credits: 19,
    attributes: { resolution: "4K", license: "COMMERCIAL" },
  },
  {
    id: "aud_301",
    type: "audio",
    title: "Ambient AI Pad — Dreamscape",
    tags: ["audio", "ambient", "loop"],
    previewUrl:
      "https://cdn.pixabay.com/download/audio/2021/08/04/audio_7b86c2c458.mp3?filename=ambient-8611.mp3",
    poster:
      "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1200&auto=format&fit=crop",
    price: 29,
    credits: 29,
    attributes: { duration: "00:30", license: "COMMERCIAL" },
  },
  {
    id: "img_102",
    type: "image",
    title: "Product Backdrop — Soft Gradient",
    tags: ["image", "background", "gradient"],
    previewUrl:
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1200&auto=format&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=600&auto=format&fit=crop",
    price: 9,
    credits: 9,
    attributes: { resolution: "2K", license: "CC0" },
  },
  {
    id: "vid_002",
    type: "video",
    title: "Minimal Product Loop — Floating Phone",
    tags: ["video", "loop", "product"],
    previewUrl:
      "https://cdn.coverr.co/videos/coverr-holding-a-smartphone-2031/1080p.mp4",
    poster:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
    price: 59,
    credits: 59,
    attributes: { resolution: "1080p", license: "COMMERCIAL" },
  },
];

// Simple in-memory mock for demo
const MOCK_API = {
  listAssets: async (q = "", type = "all", tag = "all") => {
    await delay(150);
    const ql = q.trim().toLowerCase();
    return MOCK_ASSETS.filter((a) => {
      const matchesQ = !ql || a.title.toLowerCase().includes(ql);
      const matchesType = type === "all" || a.type === type;
      const matchesTag = tag === "all" || a.tags.includes(tag);
      return matchesQ && matchesType && matchesTag;
    });
  },
  earnCreditsByAd: async (amount = 1) => {
    await delay(600);
    return amount; // credits earned
  },
  redeem: async (assetId, creditsCost) => {
    await delay(300);
    return { downloadUrl: `https://example.com/download/${assetId}` };
  },
};

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// -------------------------
// Utility Components
// -------------------------
function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-zinc-800 dark:text-zinc-200 text-gray-700">
      {children}
    </span>
  );
}

function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-sm transition ${
        active
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "bg-white/60 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return [dark, setDark];
}

// -------------------------
// Main App
// -------------------------
export default function App() {
  const [dark, setDark] = useDarkMode();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [tag, setTag] = useState("all");
  const [assets, setAssets] = useState([]);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState(null);
  const [credits, setCredits] = useState(25); // starter demo credits
  const [toast, setToast] = useState("");

  const tags = useMemo(() => {
    const s = new Set();
    MOCK_ASSETS.forEach((a) => a.tags.forEach((t) => s.add(t)));
    return ["all", ...Array.from(s)];
  }, []);

  useEffect(() => {
    (async () => {
      setBusy(true);
      const list = await MOCK_API.listAssets(q, type, tag);
      setAssets(list);
      setBusy(false);
    })();
  }, [q, type, tag]);

  function pushToast(msg) {
    setToast(msg);
    setTimeout(() => setToast("") , 2000);
  }

  async function handleWatchAd() {
    setBusy(true);
    const earned = await MOCK_API.earnCreditsByAd(1);
    setCredits((c) => c + earned);
    setBusy(false);
    pushToast(`+${earned} credit earned`);
  }

  async function handleRedeem(asset) {
    if (credits < asset.credits) {
      pushToast("Not enough credits. Watch ads or buy credits.");
      return;
    }
    setBusy(true);
    const res = await MOCK_API.redeem(asset.id, asset.credits);
    setCredits((c) => c - asset.credits);
    setBusy(false);
    pushToast("Download ready! (mock)");
    window.open(res.downloadUrl, "_blank");
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-950/70">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400"/>
            <span className="font-semibold tracking-tight">AI Stock Vault</span>
            <Badge>Demo</Badge>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark((d) => !d)}
              className="text-sm px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
            <div className="text-sm px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              Credits: <b>{credits}</b>
            </div>
            <button
              onClick={handleWatchAd}
              disabled={busy}
              className="text-sm px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black disabled:opacity-60"
            >
              {busy ? "Earning…" : "▶ Watch Ad (+1)"}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              Your one‑stop destination for <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">AI media</span>
            </h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Browse pre‑generated **images, videos, and audio**. Redeem with credits earned by watching ads, or pay‑as‑you‑go.
            </p>
            <div className="mt-6 flex gap-3">
              <input
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                placeholder="Search assets (e.g. anime, loop, product)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button
                onClick={() => setQ("")}
                className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800"
              >Clear</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              {(["all", "image", "video", "audio"]).map((t) => (
                <Pill key={t} onClick={() => setType(t)} active={type === t}>{t}</Pill>
              ))}
              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"/>
              {tags.map((t) => (
                <Pill key={t} onClick={() => setTag(t)} active={tag === t}>{t}</Pill>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-sm">
              <video src={MOCK_ASSETS[0].previewUrl} poster={MOCK_ASSETS[0].poster} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Trending</h2>
          {busy && <span className="text-sm text-zinc-500">Loading…</span>}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((a) => (
            <motion.div
              key={a.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            >
              <button onClick={() => setSelected(a)} className="block w-full text-left">
                <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  {a.type === "image" && (
                    <img src={a.poster || a.previewUrl} className="w-full h-full object-cover group-hover:scale-105 transition"/>
                  )}
                  {a.type === "video" && (
                    <video src={a.previewUrl} poster={a.poster} muted loop playsInline className="w-full h-full object-cover" />
                  )}
                  {a.type === "audio" && (
                    <div className="w-full h-full grid place-items-center text-sm text-zinc-500">Audio Preview</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium line-clamp-1">{a.title}</h3>
                    <span className="text-sm">{a.credits} cr</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {a.tags.slice(0, 3).map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </div>
              </button>
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={() => handleRedeem(a)}
                  className="flex-1 px-3 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black"
                >
                  Download ({a.credits} cr)
                </button>
                <button
                  onClick={handleWatchAd}
                  className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800"
                >
                  ▶ Watch Ad (+1)
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-4xl rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="aspect-video bg-black">
                {selected.type === "image" && (
                  <img src={selected.previewUrl} className="w-full h-full object-contain bg-black"/>
                )}
                {selected.type === "video" && (
                  <video src={selected.previewUrl} poster={selected.poster} controls autoPlay className="w-full h-full object-contain" />
                )}
                {selected.type === "audio" && (
                  <audio src={selected.previewUrl} controls className="w-full" />
                )}
              </div>
              <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{selected.title}</h3>
                  <div className="mt-1 flex gap-2 flex-wrap">
                    {Object.entries(selected.attributes || {}).map(([k, v]) => (
                      <Badge key={k}>{k}: {String(v)}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRedeem(selected)} className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black">Download ({selected.credits} cr)</button>
                  <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800">Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400"/>
              <b>AI Stock Vault</b>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Pre‑generated AI media you can preview and unlock with credits.
            </p>
          </div>
          <div>
            <b className="text-sm">Links</b>
            <ul className="mt-2 text-sm space-y-1 text-zinc-600 dark:text-zinc-400">
              <li><a className="hover:underline" href="#">Terms</a></li>
              <li><a className="hover:underline" href="#">Privacy</a></li>
              <li><a className="hover:underline" href="#">Licensing</a></li>
            </ul>
          </div>
          <div>
            <b className="text-sm">Contact</b>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">support@example.com</p>
          </div>
        </div>
      </footer>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-black text-white dark:bg-white dark:text-black px-4 py-2 shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------
// Deployment Tips (readme‑style notes):
// 1) Vercel/Netlify: Create a new project, import your GitHub repo with this
//    file as the default export in a React build. If using Next.js, put this
//    component into app/page.tsx and commit.
// 2) GitHub Pages: Use a Vite + React template, paste this component into
//    src/App.jsx, then `npm run build` and publish `dist/`.
// 3) Replace MOCK_API with your real endpoints later:
//    - GET /api/assets
//    - POST /api/credits/redeem
//    - POST /api/ads/callback → +1 credit
//    - POST /api/assets/:id/download → signed URL
// 4) Design choices: clean, mobile‑first, dark mode, ad‑to‑credit button.
// ---------------------------------------------
