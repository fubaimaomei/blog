const FP = [
  '',
  '为什么要使用函数式编程/FP-chapter-01',
  {
    title: '函数基础',
    collapsable:false,
    children: [
      '函数基础/FP-chapter-02',
      '函数基础/总结.md'
    ]
  }
]

module.exports = {
    title: '笔记',
    description: '一个总结学习的存档文件',
    base: '/blog/',
    markdown: {
      toc: { 
        includeLevel: [1,2,3,4,5,6]
      },
      lineNumbers: true
    },
    themeConfig: {
        repo: 'fubaimaomei/blog/',
        navbar: true, 
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          { text: '主页', link: '/' },
          { text: '导读', link: '/guide/' },
        ],
        lastUpdated: '更新于', // string | boolean
        displayAllHeaders: true,
        sidebarDepth: 2,
        sidebar: {
          '/FP/': FP
        }
    }
  }