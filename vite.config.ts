import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig, ConfigEnv } from 'vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus'
import compression from 'vite-plugin-compression'
import { loadEnv } from '/@/utils/vite'

const pathResolve = (dir: string): any => {
  return resolve(__dirname, '.', dir)
}

const alias: Record<string, string> = {
  '/@': pathResolve('./src/'),
  'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
}

const viteConfig = defineConfig(({ mode, command }: ConfigEnv) => {
  const env = loadEnv(mode)
  return {
    plugins: [
      vue(),
      vueSetupExtend(),
      compression({
        threshold: 5121,
        disable: !env.VITE_COMPRESSION,
        deleteOriginFile: false,
      }),
    ],
    root: process.cwd(),
    resolve: { alias },
    base: command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
    hmr: true,
    optimizeDeps: {
      include: ['element-plus/lib/locale/lang/zh-cn', 'element-plus/lib/locale/lang/en', 'element-plus/lib/locale/lang/zh-tw'],
    },
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT,
      open: env.VITE_OPEN,
      proxy: {
        '/gitee': {
          target: 'https://gitee.com',
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gitee/, ''),
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
        },
      },
    },
    css: { preprocessorOptions: { css: { charset: false } } },
    define: {
      __VUE_I18N_LEGACY_API__: JSON.stringify(false),
      __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
      __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
      __NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
      __NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
    },
  }
})

export default viteConfig
