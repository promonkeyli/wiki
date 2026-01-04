import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "wiki",
  description: "A comprehensive full-stack knowledge base covering Frontend, Backend, DevOps, and Databases.",
  srcDir: './src',
  themeConfig: {
    nav: [
      { text: 'frontend', link: '/frontend' },
      { text: 'backend', link: '/backend' },
      { text: 'devops', link: '/devops' },
    ],
    footer: {
      copyright: 'Copyright©2026-present promonkeyli'
    },
    search: {
      provider: 'local'
    },
    sidebar: {
      '/frontend/': [
        {
          text: 'html',
          collapsed: true,
          items: []
        },
        {
          text: 'css',
          collapsed: true,
          items: []
        },
        {
          text: 'js',
          collapsed: true,
          items: []
        },
        {
          text: 'ts',
          collapsed: true,
          items: []
        },
        {
          text: 'react',
          collapsed: true,
          items: []
        },
        {
          text: 'vue',
          collapsed: true,
          items: []
        },
        {
          text: 'vite',
          collapsed: true,
          items: []
        },
        {
          text: 'http',
          collapsed: true,
          items: []
        }
      ],
      '/backend/': [
        {
          text: 'go',
          collapsed: true,
          items: []
        }
      ],
      '/devops/': [
        {
          text: 'docker',
          collapsed: true,
          items: []
        },
        {
          text: 'nginx',
          collapsed: true,
          items: []
        },
        {
          text: 'k8s',
          collapsed: true,
          items: []
        }
      ],

    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/promonkeyli' }
    ]
  }
})
