---
title: モデルの場所と差し替え方
description: モデルの所在、外観選択と対応スキンの作り方。
---

# モデルの場所と差し替え方

配置画面で道具ごとの専用Prefabを選び、導入更新で反映できます。

## 道具を探す

配置セットアップ左下の **外観モデルを選ぶ・改変**、または右側の **モデル** タブを開きます。
導入済みの場合は **色・質感の改変：モデルとMaterial** を開き、道具名を押すとヒエラルキーの該当モデルを選択できます。
下のパスはアバター内の **Kiseru**（導入ルート）を起点とします。ルート名を変更した場合はその名前から辿ります。

| 道具 | 表示モデルの所在 |
| --- | --- |
| 煙管本体 | `PipeVisualRoot/PlaceholderModel` |
| 煙草入れ | `Anchors/TobaccoCaseFollow/TobaccoCaseAnchor/TobaccoCaseVisual` |
| 指の火種 | `Anchors/TobaccoPropFollow/TobaccoAnchor/TobaccoVisual/Model` |
| 火皿の火種 | `PipeVisualRoot/BowlPoint/TobaccoAnchor/TobaccoVisual/Model` |
| マッチ箱 | `Anchors/MatchBoxFollow/MatchBoxAnchor/MatchBoxVisual` |
| マッチ棒 | `Anchors/MatchPropFollow/MatchAnchor/MatchVisual/Model` |

`PlaceholderModel` は内部名ですが、現在の煙管の表示モデルを指します。
`Anchor` は取付位置、`Follow` はボーンへの追従、`Receiver/Sender` は接触判定です。
`MouthSupport` は口と添え手で支える仕組み、`BowlTiltReference` は消火するときに火皿の傾きを測る基準、
`ControlClock` は動作用です。色改変は上表のRendererに割り当てたMaterialから行います。

内部の階層名や場所はアニメーションから参照されます。整理目的で移動・改名しないでください。
標準Materialの直接編集は、それを共有する他のアバターにも反映されます。自分専用にする場合は複製して使用します。
生成されたモデルへ直接加えた改変は、再導入後の保持を保証しません。継続して使う外観は対応スキンとして登録します。

## 対応モデルを選ぶ

1. 煙管システムと対応スキンを同じプロジェクトへインポートします。
2. **モデル** タブで道具を選び、**専用Prefab** 欄へ配布されたPrefabを入れます。登録済みモデルの一覧からも選べます。
3. プレビューで配置を確認します。選択を戻したい場合は **標準モデル** を選びます。
4. **アバターの導入を更新…**（未導入なら導入）で反映し、Sceneを保存して再アップロードします。

初めて専用Prefabを入れた場合は、構造を検査して利用者用フォルダ Assets/KiseruUserSettings/Skins に選択用の定義を自動作成します。Prefab本体には書き込みません。
選択は導入設定と衣装用プリセットへ保存されます。再編集・再導入でも同じスキンを使います。
スキンのない古いプリセットは、受け手に導入済みの選択を引き継ぎます。
参照するスキンが削除されている場合は、エラーを表示して導入を止めます。スキンを再インポートするか、標準へ戻してください。
これはUnityでの外観選択です。VR内でモデルを切り替えるExpressionMenuではありません。

## 同梱の長煙管を選ぶ

**外観モデルを選ぶ・改変 → 煙管本体**の一覧で**長煙管（Kiseru_Long）**を選びます。見つからない場合は**モデル一覧を更新**を押してください。専用Prefabは `Assets/Mofcosmos/KiseruSystem/Generated/Skins/Kiseru_Long.prefab` です。

選択後は吸い口・火皿・煙管サイズをプレビューで確認してから導入を更新します。既存の標準モデルやプリセットを自動で置き換えることはありません。

## 制作者向け：対応スキンを作る

1. **モデル** タブの各道具にある **制作者向け：この種類の雛形を作成…** を押します。
2. 自作アセット用のフォルダへ保存します。同じ場所に定義 `.asset` と外観 `.prefab` ができます。
3. Prefabを開き、自作のMesh・Materialに置き換えます。Prefabルートの位置・回転・倍率は保ちます。
4. 定義の `displayName` に選択一覧で使う名称を設定します。種類は `slot`、参照先は `modelPrefab` です。
5. 定義のInspectorで構造チェックを確認し、導入・Play Mode・実VRで仕上げを確認します。

形式1は **同じ基準位置・可動構造を持つ外観** の差し替えです。
煙管の吸い口・火皿、マッチの頭薬、箱のすり面を雛形の位置に合わせて制作します。
任意の長さ・支点・開閉方式を自動解析する仕組みではありません。全体の大きさは配置画面で調整できます。

煙草入れは `TabakoCase/CaseRoot/Case01/Case02/Case03` の蓋構造と閉じた姿勢を保ちます。
マッチ箱は `InBox/OutBox/Much` と引出しの基準を保ちます。`Much` は予備のマッチで、導入後は非表示です。
火種とマッチはPrefabルートの `MeshRenderer/MeshFilter` を保ちます。
火皿の火種のMaterialには `_EmissionColor`、マッチには `_BurnProgress` が必要です。
そのプロパティが存在するだけで見た目を保証するものではなく、発光や炭化の描画も確認してください。

外観PrefabにはTransform・MeshFilter・MeshRenderer・SkinnedMeshRendererだけを含めます。
Contact、Constraint、Animator、Collider、スクリプト、Particle、Audioはシステム側が担当します。
SkinnedMeshのボーンは同じPrefab内に含め、同じ親の下に同名オブジェクトを作らないでください。
ルート、可動部の基準姿勢、必須パス、Materialプロパティ、部品種類の不一致は導入前に検査します。
形状と基準点が目視で重なるか、コントローラーと干渉しないかは別途確認が必要です。

配布するのは自分が配布権を持つMesh・Material・Texture・専用Prefabです。選択用の定義.assetも同梱できますが、利用者が専用Prefabを直接読み込む場合は必須ではありません。`.meta` を保持し、更新時もGUIDを維持してください。
システム本体、アバター、個人の配置設定、制作雛形が参照する既存素材を無断で同梱しないでください。
この雛形はシステム同梱素材や第三者素材の再配布許諾を付与しません。
第三者スキンの有償販売を想定した仕組みですが、各配布物の素材ライセンスは制作者が確認します。
