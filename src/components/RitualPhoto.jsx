import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function RitualPhoto({shot, alt, children, square = false}) {
  const url = useBaseUrl(`/img/ritual/${shot}.webp`);
  return (
    <figure>
      <a href={url} aria-label={`拡大して見る（${alt}）`}>
        <img src={url} alt={alt} width="1280" height={square ? 1280 : 720} loading="lazy" decoding="async" />
      </a>
      <figcaption>{children}</figcaption>
    </figure>
  );
}
