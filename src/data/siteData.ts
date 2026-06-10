export type TeamStat = {
  value: string;
  label: string;
};

export type Team = {
  name: string;
  school: string;
  location: string;
  slogan: string;
  logo: string;
  emblem: string;
  cover: string;
  summary: string;
  detail: string;
  tags: string[];
  stats: TeamStat[];
};

export type HeroSlide = {
  kicker: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  image: string;
};

export type Unit = {
  id: string;
  number: string;
  name: string;
  role: string;
  image: string;
  summary: string;
  detail: string;
  responsibilities: string[];
  functions: string[];
  tags: string[];
};

export type MediaType = "image" | "video" | "record";

export type MediaItem = {
  type: MediaType;
  title: string;
  caption: string;
  src: string;
  poster?: string;
  featured: boolean;
};

export type DivisionGroup = {
  slug: string;
  name: string;
  kicker: string;
  image: string;
  summary: string;
  detail: string;
  responsibilities: string[];
  tags: string[];
};

export const divisionGroups: DivisionGroup[] = [
  {
    slug: "mechanical",
    name: "机械组",
    kicker: "Mechanical",
    image: "/assets/images/unit-engineer.png",
    summary: "负责机器人结构设计、传动机构、装配维护与可靠性优化。",
    detail:
      "机械组把比赛需求转化为稳定可制造的机器人结构，围绕底盘、云台、发射、取弹和任务机构开展设计、加工、装配与迭代。组内需要兼顾强度、重量、维护效率和赛场可靠性，让机器人在高强度对抗与连续调试中保持稳定表现。",
    responsibilities: ["结构建模与方案评审", "传动和执行机构设计", "加工装配与维护优化", "可靠性测试和问题复盘"],
    tags: ["结构设计", "传动机构", "装配维护", "可靠性"]
  },
  {
    slug: "control",
    name: "电控组",
    kicker: "Control",
    image: "/assets/images/unit-sentry.png",
    summary: "负责嵌入式控制、底盘/云台/发射机构控制、传感器接入与调试。",
    detail:
      "电控组连接机器人硬件与上层策略，负责电机控制、运动控制、通信链路、传感器数据接入和整车调试。组内需要让底盘、云台、发射机构等模块稳定协同，并在训练和比赛中快速定位问题、完成参数优化。",
    responsibilities: ["嵌入式程序开发", "底盘云台和发射控制", "传感器接入与通信", "整车联调和参数优化"],
    tags: ["嵌入式", "运动控制", "通信链路", "整车调试"]
  },
  {
    slug: "algorithm",
    name: "算法组",
    kicker: "Algorithm",
    image: "/assets/images/unit-radar.png",
    summary: "负责视觉识别、目标定位、自动瞄准、决策辅助与数据调参。",
    detail:
      "算法组负责让机器人更准确地感知赛场并做出辅助决策，重点包括装甲板识别、目标定位、弹道补偿、自动瞄准和数据调参。组内需要在真实光照、运动和干扰条件下持续提升识别稳定性与响应速度。",
    responsibilities: ["视觉识别和目标跟踪", "位姿估计与弹道补偿", "自动瞄准策略", "数据采集和模型调参"],
    tags: ["计算机视觉", "目标定位", "自动瞄准", "数据调参"]
  },
  {
    slug: "hardware",
    name: "硬件组",
    kicker: "Hardware",
    image: "/assets/images/unit-hero.png",
    summary: "负责电路设计、PCB、供电系统、线束规范、硬件测试与故障排查。",
    detail:
      "硬件组为机器人提供稳定的电气基础，负责电源分配、控制板设计、PCB 绘制、线束规范和硬件测试。组内需要保障各模块供电与信号连接可靠，降低调试阶段的隐性故障，让整车系统更易维护。",
    responsibilities: ["电路和 PCB 设计", "供电与保护方案", "线束规范和接口管理", "硬件测试与故障排查"],
    tags: ["PCB", "供电系统", "线束管理", "硬件测试"]
  },
  {
    slug: "operation",
    name: "运营组",
    kicker: "Operation",
    image: "/assets/images/media-stage.svg",
    summary: "负责宣传内容、资料整理、赛事对接、招新活动和团队协作支持。",
    detail:
      "运营组负责让团队的训练成果、赛事过程和招新信息被清晰记录与传播，同时支撑赛季中的资料管理、活动组织和对外沟通。组内需要把技术团队的工作沉淀成可展示、可传承、可协作的内容体系。",
    responsibilities: ["宣传视觉和内容制作", "训练赛事资料整理", "招新与活动组织", "团队协作和对外沟通"],
    tags: ["宣传内容", "资料整理", "赛事对接", "招新活动"]
  }
];

export const team: Team = {
  name: "桂林理工大学机器人基地",
  school: "xxxx 大学",
  location: "xxxx",
  slogan: "为机甲而生，为热爱而战",
  logo: "RM",
  emblem: "/assets/images/base-emblem.png",
  cover: "/assets/images/team-placeholder.svg",
  summary:
    "我们是一支面向 RoboMaster 机甲大师赛事的学生工程战队，围绕机械、电控、视觉、算法、运营等方向持续研发与协作。",
  detail:
    "这里可以填写战队历史、赛季目标、技术积累、招新方向和赛事成绩。当前真实资料尚未提供，先使用 xxxx 作为可替换占位内容。",
  tags: ["机械结构", "嵌入式电控", "视觉算法", "战术协同", "赛事运营"],
  stats: [
    { value: "1", label: "核心战队" },
    { value: "7", label: "兵种系统" },
    { value: "5", label: "研发方向" }
  ]
};

export const heroSlides: HeroSlide[] = [
  {
    kicker: "RoboMaster Team",
    title: "让机甲在赛场上醒来",
    description:
      "从结构设计到算法调参，从赛前测试到赛场对抗，用工程能力把热血变成可执行的战术系统。",
    primaryLabel: "了解战队",
    primaryHref: "/#team",
    image: "/assets/images/hero-arena.svg"
  },
  {
    kicker: "Robot Classes",
    title: "七类兵种组成战场体系",
    description: "英雄、工程、步兵、哨兵、空中、飞镖和雷达共同构成 RoboMaster 的多角色协作网络。",
    primaryLabel: "查看兵种",
    primaryHref: "/units/",
    image: "/assets/images/unit-hero.png"
  },
  {
    kicker: "Media Bay",
    title: "记录训练、调试与比赛瞬间",
    description: "图片、视频与赛季纪录可集中展示，后续替换为真实训练照、机器人特写和比赛混剪即可上线。",
    primaryLabel: "浏览媒体",
    primaryHref: "/media/",
    image: "/assets/images/record-1.jpeg"
  }
];

export const units: Unit[] = [
  {
    id: "hero",
    number: "01",
    name: "英雄机器人",
    role: "重火力核心",
    image: "/assets/images/unit-hero.png",
    summary: "承担关键输出与目标打击任务，是队伍火力上限的重要来源。",
    detail:
      "英雄机器人通常承担高伤害输出和关键目标压制任务，是队伍打开局面、突破防线和争夺优势资源的重要力量。它需要在有限弹药、复杂掩体和敌方火力压力下寻找射击窗口，通过稳定的底盘、精准的发射机构和可靠的瞄准策略完成高价值打击。",
    responsibilities: ["压制敌方核心单位", "争夺关键区域火力主动权", "配合步兵推进突破防线", "在关键时刻完成高价值目标打击"],
    functions: ["远距离火力压制", "关键目标打击", "牵制对方防线"],
    tags: ["高能弹丸", "高精度发射", "核心输出"]
  },
  {
    id: "engineer",
    number: "02",
    name: "工程机器人",
    role: "资源与任务执行",
    image: "/assets/images/unit-engineer.png",
    summary: "负责资源获取、补给协助和场地任务，是队伍经济与持续作战能力的保障。",
    detail:
      "工程机器人更偏向任务执行与资源运营，负责矿石搬运、补给协助、场地机关交互等非纯火力任务。它的表现直接影响队伍资源节奏和续航能力，需要在稳定搬运、机构可靠性、路径规划和操作效率之间取得平衡。",
    responsibilities: ["完成矿石和资源搬运", "保障队伍补给与经济循环", "执行场地机关交互任务", "为火力单位创造持续作战条件"],
    functions: ["矿石搬运", "补给协助", "场地机关交互"],
    tags: ["机构设计", "稳定搬运", "团队保障"]
  },
  {
    id: "infantry",
    number: "03",
    name: "步兵机器人",
    role: "机动作战主力",
    image: "/assets/images/unit-infantry.png",
    summary: "数量多、机动性强，承担持续对抗、阵地推进和战术执行任务。",
    detail:
      "步兵机器人是赛场上最常见也最灵活的作战单位，承担持续对抗、阵地推进、掩护队友和战术穿插等任务。它需要兼顾机动、火力、稳定性和操控响应，是队伍战术执行是否顺畅的基础。",
    responsibilities: ["承担正面持续对抗", "推进和守住关键阵地", "掩护工程与英雄单位行动", "执行快速穿插和战术牵制"],
    functions: ["正面对抗", "阵地压制", "战术穿插"],
    tags: ["机动底盘", "快速响应", "持续输出"]
  },
  {
    id: "sentry",
    number: "04",
    name: "哨兵机器人",
    role: "自动防守单位",
    image: "/assets/images/unit-sentry.png",
    summary: "以自动化巡逻和防守为主，守护关键区域并提供持续火力威慑。",
    detail:
      "哨兵机器人主要承担自动防守与区域控制任务，通常需要在无人直接操作的状态下完成巡逻、识别、瞄准和攻击。它的核心价值在于稳定守护基地或关键通道，持续给对方施加压力，并为队伍提供防守容错。",
    responsibilities: ["自动巡逻和区域防守", "识别并打击进入防区的目标", "守护基地或关键通道", "分担人工操作单位的防守压力"],
    functions: ["自动巡逻", "基地防守", "目标识别"],
    tags: ["自动控制", "防守火力", "感知决策"]
  },
  {
    id: "aerial",
    number: "05",
    name: "空中机器人",
    role: "空中支援",
    image: "/assets/images/unit-aerial.png",
    summary: "提供空中视角、战术支援和特殊打击能力，拓展队伍的信息与攻击维度。",
    detail:
      "空中机器人负责从空中维度提供侦察、支援和特殊打击能力。它能观察地面单位难以获得的信息，帮助队伍判断敌方站位与战场态势，也可以在特定时机进行高点打击或支援压制。",
    responsibilities: ["提供空中视角和战场侦察", "辅助判断敌方站位与动向", "在关键窗口提供空中支援", "拓展队伍的信息与打击维度"],
    functions: ["空中侦察", "战术支援", "高点打击"],
    tags: ["飞控", "轻量化", "视野优势"]
  },
  {
    id: "dart",
    number: "06",
    name: "飞镖系统",
    role: "远程固定打击",
    image: "/assets/images/unit-dart.png",
    summary: "通过固定发射系统完成远程目标打击，强调定位、发射稳定性与时机判断。",
    detail:
      "飞镖系统承担远程固定打击任务，通常在特定规则窗口内对目标进行高价值攻击。它强调发射机构一致性、目标定位、轨迹控制和时机判断，一次成功打击往往能改变比分节奏或迫使对手调整防守。",
    responsibilities: ["完成远程目标打击", "在规则窗口内把握发射时机", "通过轨迹控制提高命中稳定性", "制造阶段性比分和战术压力"],
    functions: ["远程发射", "目标命中", "战术爆发"],
    tags: ["发射机构", "轨迹控制", "关键时机"]
  },
  {
    id: "radar",
    number: "07",
    name: "雷达",
    role: "战场信息感知",
    image: "/assets/images/unit-radar.png",
    summary: "为队伍提供感知、定位与信息辅助，让战术决策更及时、更有依据。",
    detail:
      "雷达负责战场信息感知和辅助决策，通过视觉识别、地图信息和目标定位帮助队伍了解敌方位置与态势变化。它本身不一定直接参与火力对抗，但能显著提升团队的信息优势和决策效率。",
    responsibilities: ["感知敌方位置和赛场态势", "为队友提供目标定位信息", "辅助战术决策和路线选择", "提升队伍整体信息透明度"],
    functions: ["场上感知", "目标定位", "信息辅助"],
    tags: ["视觉识别", "地图信息", "战术辅助"]
  }
];

export const media: MediaItem[] = [
  {
    type: "image",
    title: "战队整备区",
    caption: "可替换为真实战队合影、机器人整备或实验室照片。",
    src: "/assets/images/record-1.jpeg",
    featured: true
  },
  {
    type: "image",
    title: "机器人特写",
    caption: "用于展示底盘、云台、发射机构或传感器模块。",
    src: "/assets/images/unit-hero.png",
    featured: true
  },
  {
    type: "video",
    title: "赛季混剪",
    caption: "把 src 替换成本地 mp4 或 webm 后即可播放。",
    src: "",
    poster: "/assets/images/video-placeholder.svg",
    featured: true
  },
  {
    type: "image",
    title: "训练现场",
    caption: "记录调试、对抗训练和赛前联调过程。",
    src: "/assets/images/media-stage.svg",
    featured: false
  },
  {
    type: "record",
    title: "赛季记录",
    caption: "用于整理赛季目标、训练节点、比赛复盘和阶段性成果。",
    src: "/assets/images/media-stage.svg",
    featured: false
  }
];

export const mediaLabels: Record<MediaType, string> = {
  image: "图片",
  video: "视频",
  record: "记录"
};
