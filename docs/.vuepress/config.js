module.exports = {
    title: '夕航',
    description: '前端学习笔记',
    //添加一些头部的元素
    head: [
        //添加一个icon让tab左边的图标发生变化
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['meta',{name:'author',content:'夕航'}],
        //增加一个keywords的meta元素实现更好的SEO
        ['meta',{name:'keywords',content:'前端'}],
    ],
    themeConfig: {
        logo: '/logo.png',
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/' },
            { text: 'External', link: 'https://google.com' },
        ],
        sidebar: [
            {
                title: 'browser',   // 必要的
                path: '/browser/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 1,    // 可选的, 默认值是 1
                children: [
                    'browser/browserSummary/browserSummary',
                    'browser/browserQuestions/浏览器面试问题',
                ],
            },
            {
                title: 'js',
                children: [
                    'js/js知识总结'
                ],
            }
        ]
    }
}