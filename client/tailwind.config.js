/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#eef6ff", 100: "#d9ecff", 500: "#2563eb", 600: "#1d4ed8", 700: "#1e40af" },
        success: { 700: "#15803d" },
      },
      minHeight: { touch: "48px" },
      fontSize: { base: "1.125rem", lg: "1.25rem", xl: "1.5rem" },
    },
  },
  plugins: [],
};
