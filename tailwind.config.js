/** Tailwind CSS configuration for HCR Hyderabad Cab Rentals
 *  Brand colors are defined once here and reused via utility classes
 *  (e.g. bg-primary, text-secondary) across every page.
 */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A8A",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554"
        },
        secondary: {
          DEFAULT: "#22C55E",
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#22C55E",
          500: "#16A34A",
          600: "#15803D"
        },
        surface: "#F8FAFC"
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"]
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(15, 23, 42, 0.08)",
        card: "0 10px 30px -8px rgba(15, 23, 42, 0.15)",
        "card-hover": "0 20px 40px -10px rgba(15, 23, 42, 0.25)",
        glow: "0 0 0 1px rgba(34, 197, 94, 0.3), 0 8px 24px -4px rgba(34, 197, 94, 0.3)"
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(180deg, rgba(10,16,40,0.32) 0%, rgba(13,20,48,0.04) 48%, rgba(10,16,40,0.72) 100%)",
        "cta-gradient": "linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 55%, #15803D 100%)",
        "hero-pattern": "radial-gradient(circle at 15% 20%, rgba(34,197,94,0.25) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(96,165,250,0.3) 0%, transparent 45%)",
        "hero-base": "radial-gradient(circle at 15% 20%, rgba(34,197,94,0.35) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(96,165,250,0.35) 0%, transparent 45%), linear-gradient(135deg, #172554 0%, #1E3A8A 55%, #1E40AF 100%)"
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease forwards",
        "slide-up": "slideUp 0.8s ease forwards",
        "zoom-in": "zoomIn 0.6s ease forwards",
        float: "float 3s ease-in-out infinite",
        "pulse-ring": "pulseRing 2.2s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 30s linear infinite"
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(40px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        zoomIn: { "0%": { opacity: 0, transform: "scale(0.9)" }, "100%": { opacity: 1, transform: "scale(1)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        pulseRing: { "0%": { boxShadow: "0 0 0 0 rgba(37,211,102,0.5)" }, "70%": { boxShadow: "0 0 0 14px rgba(37,211,102,0)" }, "100%": { boxShadow: "0 0 0 0 rgba(37,211,102,0)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } }
      }
    }
  },
  plugins: []
};
