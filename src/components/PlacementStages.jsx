import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

const labels = ['初期配置', '位置調整後', '手の形を反映後'];
const stages = ['initial', 'placed', 'posed'];
const examples = {
  grip: {
    name: '煙管',
    captions: [
      '初期配置では、開いた手の前に煙管の軸が通っています。',
      '指は開いたまま、煙管の位置と向きを合わせました。火皿の位置を初期配置と見比べてください。',
      '同じ持ち位置で指を曲げ、親指と人差し指の間に煙管の軸を挟んでいます。',
    ],
    size: [720, 564],
  },
  box: {
    name: 'マッチ箱',
    captions: [
      '右手を開いた状態です。箱の細い縁がこちらを向いています。',
      '指を開いたまま、箱の位置と向きを調整しました。箱の表面が見える角度になっています。',
      '人差し指を曲げると、末節に取り付けた箱も指に沿って動きます。箱の位置・回転の設定値は前の画像と同じです。',
    ],
    size: [720, 508],
  },
};

export default function PlacementStages({item}) {
  const base = useBaseUrl('/img/shinano-editor/');
  const {name, captions, size} = examples[item];
  return (
    <Tabs>
      {stages.map((stage, index) => {
        const path = base + item + '-' + stage;
        return (
          <TabItem key={stage} value={stage} label={labels[index]}>
            <figure>
              <img src={path + '-detail.webp'} width={size[0]} height={size[1]}
                alt={name + 'の' + labels[index] + '。' + captions[index]} />
              <figcaption>{captions[index]} <a href={path + '.webp'}>設定画面全体を拡大</a></figcaption>
            </figure>
          </TabItem>
        );
      })}
    </Tabs>
  );
}
