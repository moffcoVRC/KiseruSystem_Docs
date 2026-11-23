import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const steps = [
  ['導入前の準備', '必要なアセットをそろえ、アバターを診断します。', '/docs/getting-ready'],
  ['煙管と道具の配置調整', '煙管と道具の位置を、アバターの手と口元に合わせます。', '/docs/placement'],
  ['アバターへの導入と保存', '調整した配置をアバターに反映し、Sceneを保存します。', '/docs/install'],
  ['VRでの煙管の使い方', '煙管を取り出し、煙草を詰めて火をつけます。', '/docs/ritual']
];

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const {site} = siteConfig.customFields;
  return <Layout title={site.title} description={site.tagline}>
    <main className="home">
      <section className="home-hero">
        <div className="hero-copy">
          <h1>{site.title}</h1>
          <p className="hero-lead">アバターの手や口元に煙管を合わせる手順と、VRでの火のつけ方や吸い方を説明します。</p>
          <div className="hero-actions"><Link className="button button--primary button--lg" to="/docs/editor-guide">画面を見ながら導入する <span aria-hidden="true">→</span></Link><Link className="subtle-link" to="/docs/ritual">VRでの使い方を見る</Link></div>
          <p className="hero-meta">PC向けVRChatアバター用 <span>／</span> v{site.version}</p>
        </div>
        <figure className="hero-art">
          <img src={useBaseUrl('/img/ritual/cover.webp')} width="800" height="1000" alt="煙管の軸に指を添えて一服する姿。赤い火皿から煙が立ちのぼる。"/>
          <figcaption>VRChatで一服するアバター</figcaption>
        </figure>
      </section>
      <section className="home-section" aria-labelledby="steps-title">
        <div className="section-heading"><div><p className="eyebrow">はじめての方へ</p><h2 id="steps-title">導入からVRで使うまで</h2></div><Link to="/docs/intro">このシステムについて →</Link></div>
        <div className="step-grid">{steps.map(([title,description,to],index)=><Link className="step-card" to={to} key={to}><span className="step-number">{index + 1}</span><h3>{title}</h3><p>{description}</p><span className="card-arrow" aria-hidden="true">↗</span></Link>)}</div>
      </section>
      <section className="return-section" aria-labelledby="return-title">
        <div><h2 id="return-title">別の衣装で同じ配置を使う</h2><p>配置を衣装用プリセットに保存すると、同じアバターの別の衣装でも読み込めます。</p><Link className="subtle-link" to="/docs/presets">衣装用プリセットの保存と読み込み →</Link></div>
        <div className="help-box"><h3>よくあるトラブルと対処法</h3><Link to="/docs/help#contacts">触れても道具が反応しない <span>→</span></Link><Link to="/docs/help#placement">配置や持ち方が合わない <span>→</span></Link><Link to="/docs/diagnostics">エラーの診断ログを保存する <span>→</span></Link><Link to="/docs/diagnostics#compile-errors">コンパイルエラーが出ている <span>→</span></Link></div>
      </section>
      <aside className="home-note"><strong>VRで持ち方を確認する</strong><p>コントローラーが煙管や箱に干渉すると、マッチを擦りにくい場合があります。プレビューで調整したら、実際のVRで持ち方と配置を確認してください。</p><Link to="/docs/vr-check">VRでの確認項目 →</Link><p>デスクトップなど手を使わない環境では、<Link to="/docs/instant-smoking">「今すぐ一服」</Link>を使うと自動で煙管を吸えます。</p></aside>
    </main>
  </Layout>;
}
