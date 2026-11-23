const site = require('./site.config.json');

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: site.title,
  tagline: site.tagline,
  favicon: 'img/kiseru-mark.svg',
  url: `https://${site.organizationName.toLowerCase()}.github.io`,
  baseUrl: `/${site.projectName}/`,
  organizationName: site.organizationName,
  projectName: site.projectName,
  trailingSlash: true,
  onBrokenLinks: 'throw',
  markdown: { hooks: { onBrokenMarkdownLinks: 'throw' } },
  i18n: { defaultLocale: 'ja', locales: ['ja'] },
  customFields: { site },
  presets: [['classic', {
    docs: { sidebarPath: require.resolve('./sidebars.js'), showLastUpdateTime: false },
    blog: false,
    theme: { customCss: require.resolve('./src/css/custom.css') }
  }]],
  themeConfig: {
    metadata: [{name: 'theme-color', content: '#264c45'}],
    colorMode: { defaultMode: 'light', respectPrefersColorScheme: true },
    navbar: {
      title: site.productName,
      logo: { alt: '煙管', src: 'img/kiseru-mark.svg', width: 32, height: 32 },
      items: [
        {to: '/docs/getting-ready', label: '導入手順', position: 'left'},
        {to: '/docs/ritual', label: 'VRでの煙管の使い方', position: 'left'},
        {to: '/docs/help', label: '困ったとき', position: 'left'},
        {type: 'search', position: 'right'}
      ]
    },
    footer: {
      style: 'light',
      links: [
        {title: '導入手順', items: [{label: '導入前の準備', to:'/docs/getting-ready'}, {label:'手元の配置調整', to:'/docs/placement'}, {label:'導入と保存', to:'/docs/install'}]},
        {title: '使い方と設定', items: [{label:'VRでの煙管の使い方', to:'/docs/ritual'}, {label:'衣装用プリセット', to:'/docs/presets'}, {label:'VRでの確認', to:'/docs/vr-check'}]},
        {title: 'サポート', items: [{label:'困ったとき', to:'/docs/help'}, {label:'診断ログ', to:'/docs/diagnostics'}, {label:'バージョンと配布内容', to:'/docs/release-notes'}]}
      ],
      copyright: `${site.author} · 煙管システムの説明書 · v${site.version}`
    },
    tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 3}
  }
};
