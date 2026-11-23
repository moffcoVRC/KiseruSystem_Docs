import React, {useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Rectangles are measured on the uncropped 1350 × 850 editor capture.
export default function EditorStep({shot, series, folder, alt, marks, afterMarks, drag, result, children}) {
  const base = useBaseUrl('/img/' + (folder || (series ? 'shinano-steps' : 'shinano-install')) + '/');
  const [after, setAfter] = useState(false);
  const name = series ? series + (after ? '-after' : '-before') : shot;
  const currentMarks = after && afterMarks ? afterMarks : marks;
  const url = base + name + '.webp';
  return (
    <figure className="editor-step">
      {series && <div className="editor-step-controls" role="group" aria-label={alt + 'の比較'}>
        {[false, true].map(value => <button key={String(value)} type="button"
          aria-pressed={after === value} onClick={() => setAfter(value)}>
          {value ? '操作後' : '操作前'}
        </button>)}
      </div>}
      <a href={url} className="editor-step-screen" aria-label={alt + 'の原寸画像を開く'}>
        <img src={url} width="1350" height="850" loading="lazy" decoding="async"
          alt={alt + (series ? (after ? '（操作後）' : '（操作前）') : '')} />
        {drag && !after && <svg className="editor-step-drag" viewBox="0 0 1350 850" aria-hidden="true">
          <g transform={`translate(${drag[0]} ${drag[1]}) rotate(${Math.atan2(drag[3]-drag[1],drag[2]-drag[0])*180/Math.PI})`}>
            <path d={`M0 0 H${Math.hypot(drag[2]-drag[0],drag[3]-drag[1])} m-8 -6 8 6 -8 6`} />
            <circle r="4" />
          </g>
        </svg>}
        {currentMarks.map(([x,y,w,h],i) => <span key={i} className="editor-step-mark" aria-hidden="true"
          style={{left:x/1350*100+'%',top:y/850*100+'%',width:w/1350*100+'%',height:h/850*100+'%'}}>
          <b>{i+1}</b></span>)}
      </a>
      <figcaption>
        <ol className="editor-step-key">{React.Children.toArray(children).filter(React.isValidElement)}</ol>
        {series && <div aria-live="polite">
          {after && <p className="editor-step-result">{result}</p>}
        </div>}
      </figcaption>
      {series && <details className="editor-step-detail"><summary>手元を拡大して比べる</summary>
        <div>{['before','after'].map((state,i) => <figure key={state}>
          <figcaption>{i ? '操作後' : '操作前'}</figcaption>
          <img alt={alt+'の手元（'+(i?'操作後':'操作前')+'）'} loading="lazy" decoding="async"
            width={series==='finger'?404:424} height={series==='finger'?392:489}
            src={base+series+'-'+state+'-hand.webp'} />
        </figure>)}</div></details>}
    </figure>
  );
}
