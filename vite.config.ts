import { fileURLToPath, URL } from "node:url"
import Components from "unplugin-vue-components/vite" // 自动导入 Vue 组件
import { ElementPlusResolver } from "unplugin-vue-components/resolvers" // Element Plus 组件解析器
import AutoImport from "unplugin-auto-import/vite" // 自动导入 Vue 相关 API
import legacy from "@vitejs/plugin-legacy" // 提供旧版浏览器支持（例如较老的浏览器）
import viteCompression from "vite-plugin-compression" // 用于对静态资源进行 gzip 压缩
import { defineConfig } from "vite" // Vite 配置方法
import vue from "@vitejs/plugin-vue" // Vite 官方的 Vue 插件
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
import path from "path"
import ElementPlus from "unplugin-element-plus/vite"

import eslintPlugin from "vite-plugin-eslint" // ESLint 插件，用于 Vite 项目中的代码校验
const timestamp = String(Date.now())

import vueJsx from "@vitejs/plugin-vue-jsx"
const prefix = "pre-"
// https://vite.dev/config/
export default defineConfig((mode): any => {
  console.log("mode.mode:", mode.mode)
  return {
    base: "./",
    define: {
      "process.env.VUE_APP_DATETIME": timestamp
    },
    server: {
      host: "0.0.0.0",
      open: true,
      proxy: {
        "/item-web": {
          target: `http://${prefix}item.gboss.tech`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/item-web/, "/item-web")
        },
        "/item-agent-web": {
          target: `http://${prefix}agent-item.gboss.tech`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/item-agent-web/, "/item-agent-web")
        },
        "/management-web": {
          target: `http://${prefix}management.gboss.tech`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/item-web/, "/item-web")
        }
      }
    },
    plugins: [
      // Vue.js 插件
      vue(),
      vueJsx(),
      // svgIcon
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]"
      }),

      // 自动导入组件（如 Element Plus 组件）
      Components({
        dirs: ["src/components", "src/layout"],
        dts: "./components.d.ts",
        resolvers: [ElementPlusResolver({})]
      }),

      // 自动导入常用的 Vue API，比如 'ref' 和 'vue-router'
      AutoImport({
        imports: ["vue", "vue-router"], // 自动导入 Vue 和 Vue Router 的 API
        resolvers: [ElementPlusResolver({})], // 自动导入 Element Plus 的 API
        dts: "./auto-imports.d.ts", // 生成的 TypeScript 声明文件路径
        eslintrc: {
          enabled: true, // 启用 ESLint 配置生成
          filepath: "./.eslintrc-auto-import.json" // 生成的 ESLint 配置文件路径
        }
      }),
      // 提供对旧版浏览器的支持，将现代 JavaScript 编译为旧版浏览器兼容的代码
      legacy({
        targets: ["defaults", "not IE 11"] // 目标是现代浏览器，排除 IE 11
      }),
      // 为生产环境的构建启用 gzip 压缩，减小文件体积
      viteCompression({
        threshold: 100000, // 文件大于 100Kb 开启压缩
        algorithm: "gzip", // 使用 gzip 算法进行压缩
        ext: ".gz" // 压缩后的文件扩展名
      }),

      // ESLint 插件，用于 Vite 项目中的代码校验和自动修复
      eslintPlugin({
        exclude: ["src/components/RichEditor/**"], // 忽略这个目录中的所有文件
        fix: true, // 启用自动修复功能
        cache: false // 禁用缓存，确保每次都进行代码校验
      }),
      ElementPlus({
        useSource: true
      })
    ],
    // 模块解析配置
    resolve: {
      alias: {
        // 将 '@' 别名映射到 'src' 目录，简化导入路径
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 按需导入自定义主题
          additionalData: `@use "@/styles/themeVar.scss" as *;`
        }
      }
    },

    // Rollup 的自定义构建选项
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // entryFileNames: `assets/[name].${new Date().getTime()}.js`,
          // chunkFileNames: `assets/[name].${new Date().getTime()}.js`,
          // assetFileNames: `assets/[name].${new Date().getTime()}.[ext]`,
          compact: true,
          // 将 node_modules 中的包分离到不同的 chunk 中，提升缓存和加载性能
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString()
            }
          }
        }
      },
      minify: "terser",
      terserOptions: {
        compress: {
          // drop_console: mode.mode === "prd",
          drop_debugger: mode.mode === "prd"
        }
      },
      sourcemap: true,
      // 预加载所有分割的代码块，确保所有资源在初始化时加载
      modulePreload: {
        polyfill: true
      }
    },
    // 优化选项，禁用按需加载，全部预加载
    optimizeDeps: {
      // 包含所有的视图文件，使它们在初始加载时就被处理
      include: ["vue", "vue-router", "@vueuse/core", "pinia"],
      // 强制预构建所有依赖，避免运行时加载
      force: true
    },
    // 预构建选项
    esbuild: {
      drop: mode.mode === "prd" ? ["console"] : []
    }
  }
})
