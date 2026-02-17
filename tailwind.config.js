/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Habilita dark mode com classe
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/js/**/*.ts',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
