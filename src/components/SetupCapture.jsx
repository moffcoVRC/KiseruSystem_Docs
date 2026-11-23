import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function SetupCapture({shot, detail, width, height, alt}) {
  const root = useBaseUrl('/img/shinano-install/');
  const full = root + shot + '.webp';
  return (
    <figure className="setup-capture">
      <a href={full} aria-label={alt + '。画面全体を開く'}>
        <img src={root + shot + '-' + detail + '.webp'} alt={alt}
          width={width} height={height} loading="lazy" decoding="async" />
      </a>
      <figcaption><a href={full}>画面全体を開く</a></figcaption>
    </figure>
  );
}
