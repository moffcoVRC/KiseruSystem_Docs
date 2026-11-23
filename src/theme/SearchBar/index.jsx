import React, {useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function SearchBar() {
  const dialog = useRef(null);
  const trigger = useRef(null);
  const input = useRef(null);
  const [entries, setEntries] = useState(null);
  const [failure, setFailure] = useState(false);
  const [query, setQuery] = useState('');
  const indexUrl = useBaseUrl('/search-index.json');
  async function open() {
    dialog.current.showModal();
    input.current.focus();
    if (entries !== null) return;
    setFailure(false);
    try {
      const response = await fetch(indexUrl);
      if (!response.ok) throw new Error('Search index unavailable');
      setEntries(await response.json());
    } catch {setFailure(true);}
  }
  function close() {dialog.current.close(); trigger.current.focus();}
  useEffect(() => {
    const keydown = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        trigger.current.click();
      }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, []);
  const terms = query.trim().toLocaleLowerCase('ja').split(/\s+/).filter(Boolean);
  const hits = (entries || []).filter(entry => terms.every(term => `${entry.title} ${entry.text}`.toLocaleLowerCase('ja').includes(term))).slice(0, 12);
  const snippet = entry => {
    const position = terms.length ? entry.text.toLocaleLowerCase('ja').indexOf(terms[0]) : 0;
    const start = Math.max(0, position - 24);
    return `${start ? '…' : ''}${entry.text.slice(start, start + 115)}${start + 115 < entry.text.length ? '…' : ''}`;
  };
  return <>
    <button className="search-button" ref={trigger} onClick={open} aria-label="説明書を検索" aria-haspopup="dialog">説明書を検索 <span aria-hidden="true">⌕</span></button>
    <dialog ref={dialog} className="search-dialog" aria-labelledby="search-title" onClick={event => {if (event.target === dialog.current) {const box = dialog.current.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();}}}>
      <div className="search-header"><strong id="search-title">説明書を検索</strong><button className="search-close" onClick={close}>閉じる</button></div>
      <label htmlFor="guide-query" className="sr-only">検索する言葉</label>
      <input id="guide-query" className="search-input" ref={input} value={query} onChange={event=>setQuery(event.target.value)} placeholder="例：マッチ、保存、Fist" autoComplete="off"/>
      <p className="search-status" role="status">{failure ? '検索を読み込めませんでした。閉じてから、もう一度お試しください。' : !entries ? '検索を準備しています…' : terms.length ? `${hits.length}ページ見つかりました` : '知りたい操作や、困っている症状を入力してください。'}</p>
      {entries && terms.length > 0 && <ul className="search-results">{hits.map(entry=><li key={entry.url}><Link to={entry.url} onClick={close}><strong>{entry.title}</strong><p>{snippet(entry)}</p></Link></li>)}</ul>}
    </dialog>
  </>;
}
