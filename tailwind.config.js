/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-green': '#00C853',
                'brand-orange': '#FF8000',
                'brand-red': '#FF0000',
                'brand-yellow': '#C0C000',
            },
        },
    },
    plugins: [],
}
