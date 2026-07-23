import { getKnowledgeBase } from './kbStore'

export type KnowledgeDoc = {
  id: string
  title: string
  category: string
  tags: string[]
  summary: string
  content: string
  updatedAt: string
  images?: { caption: string; svg: string }[]
}

export const seedKnowledgeBase: KnowledgeDoc[] = [
  {
    id: 'SPEC-RF-001',
    title: '海外冰箱蒸发器管路设计规范',
    category: '设计规范',
    tags: ['蒸发器', '管路', '海外', '制冷'],
    summary: '规定海外机型蒸发器管路走向、弯径、壁厚及与箱体干涉检查要求。',
    updatedAt: '2026-03-12',
    content: `## 适用范围
适用于出口北美、欧洲、中东市场的风冷/直冷冰箱蒸发器管路设计。

## 关键要求
1. **最小弯管半径**：铜管外径 ≤6.35mm 时，R ≥ 2.5D；＞6.35mm 时，R ≥ 3D。
2. **壁厚**：出口北美机型铜管壁厚不得低于 0.71mm。
3. **干涉检查**：管路与箱体内壁间隙 ≥ 8mm，与发泡层预留通道中心偏差 ≤ 3mm。
4. **焊点**：禁止在发泡通道内布置焊点；焊点距箱体开口 ≥ 50mm。

## 常见整改经验
- 2024 年 BCD-320E 项目：蒸发器出口段与侧板干涉，改为斜向抬升 12° 后通过。
- 中东高温机型需在压缩机舱增加隔热套管，降低回气管过热。`,
    images: [
      {
        caption: '蒸发器管路最小弯径示意',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 180" fill="none">
          <rect width="420" height="180" fill="#F2F7F6"/>
          <path d="M40 120 H140 Q180 120 180 80 V40" stroke="#0B3D4A" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="180" cy="80" r="3" fill="#C45C26"/>
          <path d="M180 80 Q180 120 220 120 H360" stroke="#0B3D4A" stroke-width="6" fill="none" stroke-linecap="round"/>
          <text x="150" y="155" fill="#3A5A62" font-size="13" font-family="sans-serif">R ≥ 2.5D</text>
          <text x="40" y="28" fill="#0B3D4A" font-size="14" font-family="sans-serif" font-weight="600">蒸发器出口弯管</text>
        </svg>`,
      },
    ],
  },
  {
    id: 'SPEC-RF-014',
    title: '门封条与门体装配公差规范',
    category: '设计规范',
    tags: ['门封', '公差', '密封', '装配'],
    summary: '门封压入深度、压缩量及四角圆角半径控制要求。',
    updatedAt: '2026-01-20',
    content: `## 装配公差
| 项目 | 标准值 | 允许偏差 |
| --- | --- | --- |
| 门封压入深度 | 6.0 mm | ±0.3 mm |
| 压缩量（关门态） | 2.0–2.5 mm | — |
| 四角圆角半径 | R8 | ±1 mm |

## 风险提示
压缩量不足会导致漏冷与能耗超标；过大则关门力超标（欧洲机型关门力目标 ≤ 35N）。`,
    images: [
      {
        caption: '门封压缩量截面示意',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 180" fill="none">
          <rect width="420" height="180" fill="#F2F7F6"/>
          <rect x="60" y="40" width="120" height="100" rx="4" fill="#D7E6E3" stroke="#0B3D4A"/>
          <rect x="200" y="55" width="40" height="70" rx="8" fill="#C45C26" opacity="0.85"/>
          <rect x="250" y="40" width="110" height="100" rx="4" fill="#E8F4F2" stroke="#0B3D4A"/>
          <text x="70" y="95" fill="#0B3D4A" font-size="12" font-family="sans-serif">箱体</text>
          <text x="205" y="95" fill="#fff" font-size="11" font-family="sans-serif">门封</text>
          <text x="270" y="95" fill="#0B3D4A" font-size="12" font-family="sans-serif">门体</text>
          <text x="180" y="160" fill="#3A5A62" font-size="12" font-family="sans-serif">压缩量 2.0–2.5mm</text>
        </svg>`,
      },
    ],
  },
  {
    id: 'EXP-2025-087',
    title: 'BCD-280EU 冷凝器改模经验复盘',
    category: '项目经验',
    tags: ['冷凝器', '改模', '欧洲', '能耗'],
    summary: '欧洲能效升级导致冷凝器翅片密度调整与噪声整改记录。',
    updatedAt: '2025-11-08',
    content: `## 背景
BCD-280EU 在 VDE 预测试中能效差 3%，噪声超标 1.5dB。

## 整改方案
1. 冷凝器翅片间距由 3.2mm 调整为 2.8mm，增加换热面积约 8%。
2. 压缩机减振垫硬度由 Shore 55 调整为 Shore 45。
3. 回气管包覆棉厚度由 5mm 增至 8mm。

## 结果
二次送样一次通过；改模费用约 ¥46,000；周期 18 天。

## 可复用结论
欧洲中容积段优先评估「翅片密度 + 减振垫」组合，避免单独加长冷凝器导致箱体改模。`,
  },
  {
    id: 'SPEC-EL-006',
    title: '海外电控板安规间距与爬电距离',
    category: '设计规范',
    tags: ['电控', '安规', '爬电', '海外'],
    summary: 'IEC 60335 相关爬电距离与电气间隙最小值。',
    updatedAt: '2026-02-03',
    content: `## 电气间隙 / 爬电距离（工作电压 ≤250V）
- 基本绝缘：电气间隙 ≥ 3.0mm，爬电 ≥ 4.0mm
- 加强绝缘：电气间隙 ≥ 5.0mm，爬电 ≥ 8.0mm
- 继电器触点到二次侧低压区：按加强绝缘执行

## 布局建议
高压区与低压区用丝印隔离带标识；电解电容距发热器件 ≥ 10mm。`,
  },
  {
    id: 'EXP-2024-112',
    title: '抽屉导轨卡滞整改案例库',
    category: '项目经验',
    tags: ['抽屉', '导轨', '卡滞', '装配'],
    summary: '冷藏抽屉导轨卡滞的常见根因与对策。',
    updatedAt: '2024-09-15',
    content: `## 高频根因
1. 导轨安装孔位相对箱体内胆偏差 > 1.2mm
2. 抽屉侧壁变形导致与导轨摩擦
3. 低温环境下润滑脂粘度升高

## 对策
- 孔位增加长圆孔补偿 ±1.5mm
- 侧壁增加加强筋，壁厚局部 +0.3mm
- 切换低温润滑脂（-30℃ 可用）

## 评审检查点
出图前必须核对接线孔、导轨孔与内胆模具基准是否一致。`,
    images: [
      {
        caption: '导轨孔位长圆孔补偿示意',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 160" fill="none">
          <rect width="420" height="160" fill="#F2F7F6"/>
          <rect x="80" y="55" width="90" height="36" rx="18" stroke="#0B3D4A" stroke-width="3" fill="#E8F4F2"/>
          <circle cx="125" cy="73" r="8" fill="#C45C26"/>
          <text x="200" y="70" fill="#0B3D4A" font-size="13" font-family="sans-serif">长圆孔 ±1.5mm</text>
          <text x="200" y="92" fill="#3A5A62" font-size="12" font-family="sans-serif">吸收内胆与钣金装配偏差</text>
        </svg>`,
      },
    ],
  },
  {
    id: 'RULE-REV-001',
    title: '总体设计方案评审检查清单',
    category: '评审规则',
    tags: ['评审', '合规', '检查清单'],
    summary: '用于总体设计方案评审的智能核对规则集。',
    updatedAt: '2026-04-01',
    content: `## 必查项
1. 制冷系统：蒸发器弯径、焊点位置、干涉间隙
2. 门体密封：门封压缩量、关门力
3. 电控安规：爬电距离、电气间隙
4. 结构装配：导轨/铰链孔位公差、改模风险说明
5. 海外差异：目标市场法规、能效等级、电源规格
6. 成本与可制造性：关键件是否沿用平台件
7. 关键零部件：压缩机减振、冷凝器散热、风机噪声、化霜排水、搁架承载`,
  },
  {
    id: 'SPEC-RF-021',
    title: '压缩机选型与减振安装规范',
    category: '设计规范',
    tags: ['压缩机', '减振', '噪声', '制冷'],
    summary: '海外机型压缩机选型边界、减振垫硬度与安装孔位要求。',
    updatedAt: '2026-03-28',
    content: `## 选型原则
1. 欧洲能效机优先选变频压缩机；北美大容积段可评估定频+高效冷凝器组合。
2. 工况点按目标市场最高环境温度校核：欧洲 32℃、中东 43℃、北美 38℃。
3. 排气温度连续运行不得超过厂商限值（常见 ≤ 110℃）。

## 减振与安装
| 项目 | 要求 |
| --- | --- |
| 减振垫硬度 | 家用冰箱 Shore 45–55；展示柜可 Shore 55–65 |
| 安装孔位偏差 | ≤ ±1.0 mm |
| 管路应力 | 开机后管路不得明显拉扯减振垫 |
| 接地 | 压缩机壳体可靠接地，接地电阻按目标市场标准 |

## 常见问题
- 噪声超标：先查减振垫硬度与管路刚性传递，再查风机。
- 中东高温机：压缩机舱需加强通风，避免回气过热导致保护频繁。`,
  },
  {
    id: 'SPEC-RF-028',
    title: '冷凝器散热与压缩机舱布置规范',
    category: '设计规范',
    tags: ['冷凝器', '散热', '压缩机舱', '通风'],
    summary: '冷凝器与压缩机舱进排风、清洁维护及温升限值。',
    updatedAt: '2026-02-18',
    content: `## 布置要求
1. 冷凝器进风口有效流通面积不得被包装、装饰板大面积遮挡。
2. 压缩机舱内冷凝器表面到邻近发热件间距 ≥ 15mm。
3. 嵌入式机型必须给出最小散热间隙：左右/背部通常 ≥ 50mm（以说明书为准）。

## 温升与能效
- 冷凝器出口过冷度目标按系统匹配表执行；预测试冷凝温度异常升高时优先查积灰与风道短路。
- 翅片冷凝器翅片间距过密（＜2.5mm）时，中东沙尘市场需评估清洗周期。

## 可制造性
优先沿用平台冷凝器；改翅片密度或加长冷凝器前，评估箱体后背模具与管路改动量。`,
  },
  {
    id: 'SPEC-RF-033',
    title: '箱内风机与风道噪声控制规范',
    category: '设计规范',
    tags: ['风机', '风道', '噪声', '风冷'],
    summary: '贯流/轴流风机选型、风道间隙与噪声验收要点。',
    updatedAt: '2026-01-09',
    content: `## 关键尺寸
1. 叶轮与蜗壳/导流罩径向间隙建议 1.5–3.0mm，过小易擦壳，过大效率下降。
2. 风机支架与箱体连接处应有减振，避免钣金共振。
3. 出风口不得直吹温度传感器，否则控温波动大。

## 噪声
- 欧洲机夜间模式风机转速策略需单独验证。
- 异音高频点优先排查：叶轮动平衡、冰堵局部、导流片松动。

## 防冻与凝露
风道接缝处密封不良会导致漏风结霜；发泡前风道必须做气密点检。`,
  },
  {
    id: 'SPEC-RF-041',
    title: '门铰链承重与开合耐久规范',
    category: '设计规范',
    tags: ['铰链', '门体', '耐久', '承重'],
    summary: '门体铰链承重、开门角度与耐久循环要求。',
    updatedAt: '2026-04-05',
    content: `## 承重与角度
| 项目 | 家用冰箱 | 商用展示柜（玻璃门） |
| --- | --- | --- |
| 单门设计承重 | 按门体+瓶架满载校核 | 按玻璃门自重+1.5 倍安全系数 |
| 最大开启角度 | 通常 130°–145° | 按场景 90°/135° |
| 门体下沉 | 满载静置 24h 下沉 ≤ 2mm | ≤ 3mm |

## 耐久
- 家用：开合循环通常按 10 万次级验证（以项目大纲为准）。
- 铰链轴与衬套配合过紧会导致关门力超标；过松会异响。

## 海外注意
欧洲机需同时满足关门力与密封；北美大容积对开门铰链左右对称性要重点校核。`,
  },
  {
    id: 'SPEC-RF-047',
    title: '搁架玻璃层板承载与防滑规范',
    category: '设计规范',
    tags: ['搁架', '玻璃层板', '承载', '内饰'],
    summary: '冷藏室玻璃搁架静载、冲击与防滑条要求。',
    updatedAt: '2025-12-20',
    content: `## 承载
1. 标准玻璃搁架均布静载按项目规格（常见单层 ≥ 30–40kg 级，以企标为准）。
2. 悬臂式瓶架需单独校核前倾力矩，避免门体开启时掉瓶。
3. 钢化玻璃边缘崩裂判定：运输振动后不得出现危及安全的裂纹。

## 装配
- 搁架支撑筋与内胆一体成型时，拔模与加强要兼顾承载。
- 防滑条高度过高会影响容器进出；过低则瓶罐易滑。

## 常见失效
支撑筋根部应力集中开裂：优先加 R 角与局部壁厚，而不是盲目加高筋。`,
  },
  {
    id: 'SPEC-RF-052',
    title: '化霜加热器与排水系统规范',
    category: '设计规范',
    tags: ['化霜', '加热器', '排水', '接水盘'],
    summary: '化霜加热功率、排水管坡度与接水盘容量要求。',
    updatedAt: '2026-02-26',
    content: `## 化霜
1. 加热器表面不得直接贴靠易熔塑料件；安全距离按安规与供应商规范。
2. 化霜传感器位置应能代表蒸发器结霜最严重区域。
3. 化霜结束后排水时间要足以排空，避免残水二次结冰。

## 排水
| 项目 | 要求 |
| --- | --- |
| 排水管内径 | 常用 ≥ φ12–16（按系统水量） |
| 排水坡度 | 水平段避免倒坡，建议有连续下落趋势 |
| 接水盘 | 容量覆盖最大化霜水量+余量；高温机需评估蒸发能力 |

## 失效案例方向
排水管发泡偏移压扁 → 化霜溢水；接水盘过小 → 中东高温机舱积水腐蚀。`,
  },
  {
    id: 'SPEC-RF-058',
    title: '温度传感器布置与控温精度规范',
    category: '设计规范',
    tags: ['传感器', '温控', 'NTC', '控温'],
    summary: '冷藏/冷冻室 NTC 布置、线束固定与控温验证要求。',
    updatedAt: '2026-03-02',
    content: `## 布置原则
1. 传感器应处于代表该间室平均温度的位置，避开出风口直吹与门封附近强热桥。
2. 冷冻室传感器需防止结冰包裹导致响应迟滞。
3. 线束固定间距合理，不得受力拉扯焊点。

## 精度与验证
- 空载稳态、负载、开关门工况均需测点验证。
- 欧洲能效测试装载方式与实验室测点需提前对齐，避免“实验室达标、能效所不达标”。

## 售后高频
传感器脱落、插接件进湿导致阻值漂移：结构上要有防脱卡扣与滴水遮蔽。`,
  },
  {
    id: 'SPEC-RF-063',
    title: '箱体发泡与预埋件定位规范',
    category: '设计规范',
    tags: ['发泡', '箱体', '预埋件', '内胆'],
    summary: '发泡密度、预埋管/线槽定位及常见缺陷预防。',
    updatedAt: '2026-01-30',
    content: `## 发泡
1. 发泡前确认蒸发器管路、排水管、线槽已固定且无泄漏风险。
2. 发泡密度与填充率按工艺卡执行；缺料会导致局部结露与强度不足。
3. 外箱与内胆定位销必须复位，防止发泡后变形超差。

## 预埋件
- 铰链板、导轨座、压缩机底板等预埋件位置度通常按 ±1.0–1.5mm 管控。
- 发泡枪嘴路径不得直接冲击易移位零件。

## 检查
开箱后重点查：侧板鼓包、门框变形、排水管畅通、管路是否被泡料包裹异常。`,
  },
  {
    id: 'SPEC-RF-070',
    title: '展示柜玻璃门与除雾系统规范',
    category: '设计规范',
    tags: ['展示柜', '玻璃门', '除雾', '商用'],
    summary: '商用展示柜玻璃门密封、除雾膜与凝露控制要求。',
    updatedAt: '2026-04-12',
    content: `## 玻璃门
1. 中空玻璃干燥剂有效期与合片工艺需可控，避免内部起雾。
2. 门体密封条压缩量参照家用门封逻辑，但需兼顾频繁开关与低温脆性。
3. 自关闭阻尼铰链力矩要匹配门重，防止回弹夹手或关不严。

## 除雾
- 加热膜功率按环境湿度工况设计；过功率费电，欠功率门面凝露影响陈列。
- 加热回路需有温控/限温保护，满足安规。

## 商用场景
超市开放式柜与玻璃门柜的负荷差异大，蒸发器化霜策略不可直接照搬家用冰箱。`,
  },
  {
    id: 'SPEC-RF-076',
    title: '调节脚、脚轮与包装运输规范',
    category: '设计规范',
    tags: ['调节脚', '脚轮', '包装', '运输'],
    summary: '柜体调平、移动脚轮承重与运输固定要求。',
    updatedAt: '2025-11-22',
    content: `## 调节脚 / 脚轮
1. 调节脚螺纹有效旋出量应覆盖地面不平度（常见设计余量 ≥ 15–20mm）。
2. 带脚轮机型需有锁定装置；承重按整机+内容物最大值校核。
3. 商用柜移动时重心高，防倾倒提示与包装标识必须齐全。

## 包装运输
- 压缩机运输固定件（如运输螺栓）在安装说明中明确拆除步骤。
- 纸箱抗压、护角、底托强度按跌落/堆码试验大纲。

## 售后
调平不当导致门封局部不贴合：安装指导需图示四脚调节顺序。`,
  },
  {
    id: 'SPEC-EL-012',
    title: '灯具、门开关与低压线束规范',
    category: '设计规范',
    tags: ['灯具', '门开关', '线束', '照明'],
    summary: 'LED 灯板散热、门开关行程与线束过孔防护要求。',
    updatedAt: '2026-03-15',
    content: `## 照明
1. LED 灯板与塑料件之间保留散热间隙；长时间开门高温不烫手、不变形。
2. 灯光色温与显色按目标市场零售陈列需求（展示柜更敏感）。

## 门开关
- 门开关有效触发行程需覆盖门封压缩与铰链公差叠加。
- 防水防凝露：开关安装面应避开直接滴水路径。

## 线束
过孔必须护套；发泡区域线束不得裸露受力。插接件编码防呆，避免售后接错导致灯不亮/不停机。`,
  },
  {
    id: 'EXP-2025-143',
    title: '中东高温机压缩机舱过热整改',
    category: '项目经验',
    tags: ['压缩机舱', '高温', '中东', '散热'],
    summary: '43℃ 工况压缩机频繁保护的风道与隔热整改记录。',
    updatedAt: '2025-08-19',
    content: `## 现象
中东样机在 43℃ 环温满载运行 4h 后压缩机保护，冷凝温度偏高。

## 原因
1. 冷凝器进风被装饰背板局部遮挡约 30% 有效面积。
2. 回气管靠近排气管，热交换导致回气过热。
3. 压缩机舱隔热不足，电机舱热量串入。

## 对策
- 背板开孔率提升，增加导风筋。
- 回/排气管间距拉大并加隔热套管。
- 优化舱内密封，减少热风短路。

## 结果
保护动作消失；能效测试恢复到目标区间。可复用：高温市场先做“进风有效面积 + 回排隔离”检查。`,
  },
  {
    id: 'EXP-2024-156',
    title: '玻璃搁架运输破损率下降案例',
    category: '项目经验',
    tags: ['搁架', '玻璃', '包装', '破损'],
    summary: '出口海运玻璃搁架破损的包装与结构联合改进。',
    updatedAt: '2024-12-03',
    content: `## 问题
海运索赔中玻璃搁架破损占比高，集中在角部崩裂。

## 改进
1. 搁架四角增加纸护角+EPE 缓冲。
2. 内胆支撑筋 R 角加大，降低装配应力。
3. 包装底托增加横向限位，减少搁架窜动。

## 效果
破损率下降约 60%。结论：玻璃件问题往往是“结构应力 + 包装窜动”叠加，需同步改。`,
  },
]

export const reviewRules = [
  {
    id: 'R1',
    name: '蒸发器管路弯径合规',
    keyword: ['蒸发器', '管路', '弯', '铜管'],
    check: (text: string) => {
      const hasBend = /弯径|弯管|R\s*[≥>=]?\s*\d/i.test(text)
      const ok = /R\s*[≥>=]\s*2\.5|弯径\s*[≥>=]\s*2\.5|最小弯/i.test(text)
      if (!hasBend) return { status: 'missing' as const, detail: '方案未提及蒸发器弯径要求' }
      if (!ok) return { status: 'risk' as const, detail: '提到弯径但未明确满足 R≥2.5D（小管）要求' }
      return { status: 'pass' as const, detail: '已覆盖弯径要求' }
    },
  },
  {
    id: 'R2',
    name: '管路干涉间隙',
    keyword: ['干涉', '间隙', '发泡'],
    check: (text: string) => {
      const mentioned = /干涉|间隙|≥\s*8|大于\s*8/i.test(text)
      const ok = /间隙\s*[≥>=]\s*8|≥\s*8\s*mm/i.test(text)
      if (!mentioned) return { status: 'missing' as const, detail: '缺少与箱体干涉间隙说明' }
      if (!ok) return { status: 'risk' as const, detail: '干涉检查未给出 ≥8mm 量化标准' }
      return { status: 'pass' as const, detail: '干涉间隙要求明确' }
    },
  },
  {
    id: 'R3',
    name: '门封压缩量',
    keyword: ['门封', '密封', '压缩'],
    check: (text: string) => {
      const mentioned = /门封|密封条|压缩量/i.test(text)
      const ok = /2\.0|2\.5|2-2\.5|2\.0\s*[–\-]\s*2\.5/i.test(text)
      if (!mentioned) return { status: 'missing' as const, detail: '未说明门封压缩量设计' }
      if (!ok) return { status: 'risk' as const, detail: '门封相关描述缺少 2.0–2.5mm 压缩量目标' }
      return { status: 'pass' as const, detail: '门封压缩量符合规范区间' }
    },
  },
  {
    id: 'R4',
    name: '电控安规间距',
    keyword: ['电控', '爬电', '安规', '电气间隙'],
    check: (text: string) => {
      const mentioned = /电控|爬电|安规|电气间隙|PCB/i.test(text)
      const ok = /爬电|电气间隙|3\.0|加强绝缘/i.test(text)
      if (!mentioned) return { status: 'missing' as const, detail: '未覆盖电控安规布局说明' }
      if (!ok) return { status: 'risk' as const, detail: '电控描述缺少爬电/电气间隙量化' }
      return { status: 'pass' as const, detail: '安规间距已说明' }
    },
  },
  {
    id: 'R5',
    name: '目标市场法规',
    keyword: ['市场', '能效', 'CE', 'UL', '法规'],
    check: (text: string) => {
      const ok = /欧洲|北美|中东|CE|UL|能效|IEC|VDE/i.test(text)
      if (!ok) return { status: 'missing' as const, detail: '未标明目标市场及适用法规/能效要求' }
      return { status: 'pass' as const, detail: '目标市场与法规信息已给出' }
    },
  },
  {
    id: 'R6',
    name: '改模与平台件策略',
    keyword: ['改模', '平台', '沿用', '成本'],
    check: (text: string) => {
      const ok = /改模|平台件|沿用|共用|模具/i.test(text)
      if (!ok) return { status: 'missing' as const, detail: '缺少改模风险或平台件沿用说明' }
      return { status: 'pass' as const, detail: '已说明改模/平台件策略' }
    },
  },
]

export const sampleScheme = `【BCD-350EU 总体设计方案摘要】
目标市场：欧洲（CE / 能效 Label D）
制冷系统：风冷，蒸发器出口铜管 φ6.35，最小弯径 R≥2.5D，管路与箱体间隙≥8mm，焊点避开发泡通道。
门体：门封压缩量按 2.2mm 设计，关门力目标 ≤35N。
电控：主板按 IEC 60335，加强绝缘爬电≥8mm。
结构：冷藏抽屉导轨孔采用长圆孔补偿；冷凝器沿用 BCD-320 平台件，预计无需改模。
`

export type ChatSource = {
  id: string
  title: string
  category: string
  excerpt: string
}

export type ChatAnswer = {
  markdown: string
  sources: ChatSource[]
  images: { caption: string; svg: string; from: string }[]
}

function extractTerms(text: string): string[] {
  const terms = new Set<string>()
  const normalized = text.toLowerCase()

  for (const part of normalized.split(/[\s,，、。？?！!；;：:（）()\-/【】\[\]\|]+/).filter(Boolean)) {
    if (part.length >= 2) terms.add(part)
    // 中文连续切分：2~4 字窗口，避免整句匹配失败
    for (let n = 2; n <= 4; n++) {
      for (let i = 0; i <= part.length - n; i++) {
        const slice = part.slice(i, i + n)
        if (/[\u4e00-\u9fff]/.test(slice) || /[a-z0-9]/.test(slice)) {
          terms.add(slice)
        }
      }
    }
  }

  for (const m of normalized.match(/[a-z][a-z0-9-]{1,}|\d+(?:\.\d+)?(?:mm|d)?/gi) ?? []) {
    terms.add(m.toLowerCase())
  }

  return [...terms]
}

/** 过宽泛、不能单独作为命中依据的词 */
const STOP_TERMS = new Set([
  '冰箱',
  '冰柜',
  '冷柜',
  '海外',
  '机型',
  '产品',
  '设计',
  '规范',
  '要求',
  '标准',
  '怎么',
  '什么',
  '多少',
  '如何',
  '进行',
  '相关',
  '信息',
  '问题',
  '内容',
  '说明',
  '出口',
  '市场',
  '北美',
  '欧洲',
  '中东',
])

function isUsefulTerm(term: string): boolean {
  if (term.length < 2) return false
  if (STOP_TERMS.has(term)) return false
  return true
}

function scoreDoc(doc: KnowledgeDoc, q: string): number {
  const query = q.toLowerCase()
  const bag = `${doc.title} ${doc.tags.join(' ')} ${doc.summary} ${doc.content}`.toLowerCase()
  let score = 0

  for (const tag of doc.tags) {
    const t = tag.toLowerCase()
    if (!isUsefulTerm(t)) continue
    if (query.includes(t)) score += 10
  }

  for (const word of extractTerms(doc.title)) {
    if (!isUsefulTerm(word)) continue
    if (query.includes(word)) score += 6
  }

  for (const token of extractTerms(q)) {
    if (!isUsefulTerm(token)) continue
    if (!bag.includes(token)) continue
    score += token.length >= 4 ? 3 : 1
    if (doc.title.toLowerCase().includes(token)) score += 2
  }

  return score
}

export function retrieveDocs(question: string, limit = 3): KnowledgeDoc[] {
  const knowledgeBase = getKnowledgeBase()
  if (knowledgeBase.length === 0) return []

  // 分数过低视为未命中，避免「冰箱」等宽泛词拖出无关规范与图示
  const MIN_SCORE = 5

  const ranked = knowledgeBase
    .map((d) => ({ d, s: scoreDoc(d, question) }))
    .sort((a, b) => b.s - a.s)

  return ranked.filter((x) => x.s >= MIN_SCORE).slice(0, limit).map((x) => x.d)
}

export function buildRagContext(docs: KnowledgeDoc[]): string {
  if (!docs.length) return '（知识库未命中相关文档）'
  return docs
    .map(
      (d) =>
        `### [${d.id}] ${d.title}\n分类：${d.category}\n摘要：${d.summary}\n\n${d.content}`,
    )
    .join('\n\n---\n\n')
}

export function docsToAnswerMeta(docs: KnowledgeDoc[]): Pick<ChatAnswer, 'sources' | 'images'> {
  return {
    sources: docs.map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      excerpt: d.summary,
    })),
    images: docs.flatMap((d) =>
      (d.images ?? []).map((img) => ({ ...img, from: d.id })),
    ),
  }
}

/** 本地兜底（无 API Key / 百炼调用失败时） */
export function answerQuestion(question: string): ChatAnswer {
  const top = retrieveDocs(question)
  if (top.length === 0) {
    return {
      markdown: `未在知识库中检索到与「**${question}**」高度相关的条目。

建议换用更具体的零部件关键词，例如：\`蒸发器弯径\`、\`门封压缩量\`、\`爬电距离\`、\`导轨卡滞\`。`,
      sources: [],
      images: [],
    }
  }
  const primary = top[0]
  const excerpt = primary.content.split('\n').filter(Boolean).slice(0, 8).join('\n')
  const bullets = top.map((d) => `- **${d.title}**（${d.id}）：${d.summary}`).join('\n')
  return {
    markdown: `（本地兜底，未走百炼）与「**${question}**」相关依据：

### 综合结论
${primary.summary}

### 详细依据（${primary.id}）
${excerpt}

### 关联知识
${bullets}`,
    ...docsToAnswerMeta(top),
  }
}

export function reviewRulesText(): string {
  return reviewRules.map((r) => `- ${r.id} ${r.name}`).join('\n')
}

export type ReviewItem = {
  id: string
  name: string
  status: 'pass' | 'risk' | 'missing'
  detail: string
  relatedDocs: string[]
}

export function runDesignReview(scheme: string): ReviewItem[] {
  const knowledgeBase = getKnowledgeBase()
  return reviewRules.map((rule) => {
    const result = rule.check(scheme)
    const related = knowledgeBase
      .filter((d) => rule.keyword.some((k) => `${d.title}${d.content}`.includes(k)))
      .slice(0, 2)
      .map((d) => d.id)
    return {
      id: rule.id,
      name: rule.name,
      status: result.status,
      detail: result.detail,
      relatedDocs: related,
    }
  })
}
