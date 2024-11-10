import path from "path";
// vite.config.js
export default {
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    }
}