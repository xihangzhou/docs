module.exports = {
    base: '/docs/',
    title: '夕航',
    description: '前端学习笔记',
    //添加一些头部的元素
    head: [
        //添加一个icon让tab左边的图标发生变化
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['meta', { name: 'author', content: '夕航' }],
        //增加一个keywords的meta元素实现更好的SEO
        ['meta', { name: 'keywords', content: '前端' }],
    ],
    themeConfig: {
        logo: '/logo.png',
        nav: [
            { text: '首页', link: '/' },
            { text: '前言', link: '/guide/' },
            {
                text: '前端',
                items: [
                    { text: 'JS', link: '/js/' },
                    { text: 'CSS', link: '/css/' },
                    { text: '浏览器', link: '/browser/' },
                    { text: 'Vue', link: '/vue/' },
                    { text: 'Webpack', link: '/webpack/' },
                ]
            },
            {
                text: '计算机基础',
                items: [
                    { text: '计算机网络', link: '/network/' },
                    // { text: '操作系统', link: '/os/' },
                    // { text: '数据库', link: '/database/' },
                    { text: '数据结构与算法', link: '/algorithm/' },
                ]
            },
            {text: '面试总结',link:'/interview/interview.md'},
        ],
        sidebar: {
            '/js/': [
                '',
                'js_ks/js_ks',
                'js_patch/js_patch',
            ],
            '/css/': [
                '',
                'css_ks/css_ks',
                'css_patch/css_patch',
            ],
            '/browser/': [
                '',
                'browser_ks/browser_ks',
                'browser_patch/browser_patch',
            ],
            '/vue/': [
                '',
                'vue_ks/vue_ks',
                'vue_patch/vue_patch',
            ],
            '/webpack/': [
                '',
                'webpack_ks/webpack_ks',
                'webpack_patch/webpack_patch',
            ],
            '/network/': [
                '',
                'network_ks/network_ks',
                'network_patch/network_patch',
            ],
            '/os/': [
                '',
                'os_ks/os_ks',
                'os_patch/os_patch',
            ],
            '/algorithm/': [
                '',
                'algorithm_ks/algorithm_ks',
                'algorithm_patch/algorithm_patch',
            ],
            '/interview/':[
                'interview',
            ]
        }
    },
    //使用插件，使得所有图片的路径进行中文的转义
    markdown: {
        extendMarkdown: md => {
            md.use(require("markdown-it-disable-url-encode"));
        }
    }
}