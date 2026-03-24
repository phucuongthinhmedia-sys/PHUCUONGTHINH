/** @type {import('tailwindcss').Config} */
const sharedConfig = {
  theme: {
    extend: {
      // ─── Brand / Public-site tokens ───────────────────────────────────────
      colors: {
        // Public frontend brand palette
        brand: {
          primary: "#8B2E16", // đỏ mực tàu / nâu đất — main brand colour
          secondary: "#F5F0E8", // vàng giấy cũ — background
          accent: "#4A5240", // xanh rêu — secondary accent
          paper: "#EDE8D8", // vàng đậm — border / divider
          zalo: "#0068FF",
        },

        // ─── Admin / CMS semantic tokens (CSS-variable-driven) ──────────────
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },

      // ─── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // ─── Spacing extras ───────────────────────────────────────────────────
      spacing: {
        128: "32rem",
      },

      // ─── Animations ───────────────────────────────────────────────────────
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        slideUp: "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

module.exports = sharedConfig;
