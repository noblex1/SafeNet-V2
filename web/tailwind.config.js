/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Ubuntu",
          "Cantarell",
          "Noto Sans",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      colors: {
        neon: {
          cyan: "#00f5ff",
          blue: "#0066cc",
          purple: "#6366f1",
        },
        safenet: {
          bg: "hsl(220, 27%, 8%)",
          surface: "hsl(220, 27%, 12%)",
          surface2: "hsl(220, 27%, 10%)",
          text: {
            primary: "hsl(210, 20%, 98%)",
            secondary: "hsl(210, 20%, 80%)",
            tertiary: "hsl(210, 20%, 65%)",
          },
          border: "rgba(255, 255, 255, 0.10)",
          divider: "rgba(255, 255, 255, 0.10)",
          glass: {
            bg: "rgba(255, 255, 255, 0.05)",
            border: "rgba(255, 255, 255, 0.10)",
          },
          status: {
            pending: "rgba(251, 191, 36, 0.15)",
            verified: "rgba(0, 245, 255, 0.15)",
            false: "rgba(248, 113, 113, 0.15)",
            resolved: "rgba(96, 165, 250, 0.15)",
          },
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 0 1px rgba(0,245,255,.25), 0 8px 30px rgba(0,245,255,.12)",
        "glow-soft": "0 10px 30px rgba(0,0,0,.35)",
        "glass": "0 12px 32px rgba(0,0,0,.40)",
      },
      backgroundImage: {
        "safenet-radial":
          "radial-gradient(1200px circle at 20% 0%, rgba(0,245,255,.10), transparent 40%), radial-gradient(900px circle at 90% 10%, rgba(99,102,241,.12), transparent 42%), radial-gradient(900px circle at 30% 110%, rgba(0,102,204,.10), transparent 45%)",
      },
    },
  },
  plugins: [],
}
