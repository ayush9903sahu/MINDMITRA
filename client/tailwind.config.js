/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9ecff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
        },
      },
      fontSize: {
        base: "1.125rem", // 18px baseline for readability
        lg: "1.25rem",
        xl: "1.5rem",
      },
    },
  },
  plugins: [],
};
