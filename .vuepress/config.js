const sidebar = require("./config/sidebar-auto.js");
// const FP = [
//     '',
//     '为什么要使用函数式编程/FP-chapter-01',
//     {
//         title: '函数基础',
//         collapsable: false,
//         children: [
//             '函数基础/FP-chapter-02',
//             '函数基础/总结.md'
//         ]
//     },
//     'Inputs/FP-chapter-03',
//     '组合函数/FP-chapter-04',
//     '副作用/FP-chapter-05',
//     '值的不可变性/FP-chapter-06',
//     '对象VS闭包/FP-chapter-07',
//     '列表操作/FP-chapter-08',
//     '递归/FP-chapter-09',
//     '异步/FP-chapter-10',
//     '实战/FP-chapter-11',
// ]

module.exports = {
    title: '笔记',
    description: '一个总结学习的存档文件',
    markdown: {
        toc: {
            includeLevel: [1, 2, 3, 4, 5, 6]
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
            {
                text: 'CRUD',
                items: [
                    { text: 'SQL', link: '/SQL/' },
                    { text: 'CRDU实践', link: '/CRUD/' }
                ]
            },
            {
                text: '大前端',
                items: [
                    { text: '程序员的数学基础知识', link: '/math/' },
                    { text: '面试常考知识点速览', link: '/interview/' },
                    { text: '数据结构与算法', link: '/arithmetic/' },
                    { text: '前端知识框架', link: '/frame/' }
                ]
            }
        ],
        lastUpdated: '更新于', // string | boolean
        displayAllHeaders: true,
        sidebarDepth: 2,
        sidebar
    },
    // plugins: [
    //   [
    //     'vuepress-plugin-comment',
    //     {
    //       choosen: 'gitalk', 
    //       options: {
    //         clientID: 'b586fff99ca93144883f',
    //         clientSecret: '54ce8f0616c663d8055606e52ccfdbc65a4e43b0',
    //         repo: 'blog',
    //         owner: 'fubaimaomei',
    //         admin: ['fubaimaomei'],
    //         distractionFreeMode: false 
    //       }
    //     }
    //   ]
    // ]
    plugins: [
        require('./plugins/myloader'),
        require('./plugins/myrouter'),
        'vuepress-plugin-viewer',
        '@vuepress/active-header-links',
        '@vuepress/back-to-top',
        '@vuepress/nprogress', [
            'vuepress-plugin-comment',
            {
                choosen: 'gitalk',
                options: {
                    id: '<%- frontmatter.commentid || frontmatter.permalink %>',
                    title: '「Comment」<%- frontmatter.title %>',
                    body: '<%- frontmatter.title %>：<%-window.location.origin %><%- frontmatter.to.path || window.location.pathname %>',
                    clientID: 'b586fff99ca93144883f',
                    clientSecret: '54ce8f0616c663d8055606e52ccfdbc65a4e43b0',
                    repo: 'blog',
                    owner: 'fubaimaomei',
                    admin: ['fubaimaomei'],
                    distractionFreeMode: false,
                }
            }
        ],
        [
            '@vuepress/pwa',
            {
                serviceWorker: true,
                updatePopup: {
                    message: "发现新内容可用",
                    buttonText: "刷新"
                }
            }
        ]
    ]
}