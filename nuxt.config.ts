// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    routeRules: {
        '/': { redirect: '/web/login' }
    },

    runtimeConfig: {
        public: {
            apiBase: 'http://13.200.174.164:3001/v1',
        }
    },

    modules: [
        '@nuxt/ui',
        '@vueuse/nuxt'
    ],
    css: ['~/assets/css/main.css'],

    // axios: {
    //     baseURL: 'http://13.200.174.164:3001/v1',
    // },

    colorMode: {
        preference: 'system', // default value of $colorMode.preference
        fallback: 'light', // fallback value if no preference is stored
        hid: 'nuxt-color-mode-script',
        globalName: '__NUXT_COLOR_MODE__',
        componentName: 'ColorScheme',
        classPrefix: '',
        classSuffix: '',
        storageKey: 'nuxt-color-mode'
    }
})
