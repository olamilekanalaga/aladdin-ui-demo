import type { Metadata, Viewport } from "next";
import { Syne, DM_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import ThemeInit from "./components/ThemeInit";

const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-display" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--font-mono" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Aladdin — Evidence-first on-chain intelligence",
  description: "Search tokens and wallets, investigate directly through Terminal, or ask blockchain questions in natural language.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `(function(){try{var m=localStorage.getItem("aladdin-theme-mode");var r=m==="light"?"light":m==="system"?(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):"dark";document.documentElement.dataset.theme=r;document.documentElement.dataset.themeMode=m||"dark";document.documentElement.dataset.accent="purple";document.documentElement.style.colorScheme=r;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable} ${instrumentSerif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
