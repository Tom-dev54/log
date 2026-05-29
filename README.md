# XHS Retro

一个面向小红书/短视频创作者的内容流程管理 App。它把选题、内容制作、发布前评分、发布记录和复盘放在一个移动端工作台里，适合持续追踪内容表现。

## 核心功能

- 创作看板：查看内容在不同阶段的数量和最近动态
- 选题管理：记录选题、标签、灵感来源和状态
- 内容流程：草稿、待发布、已发布、待复盘等状态流转
- 发布前评分：用维度评分判断内容质量
- 预测与复盘：发布前预估表现，发布后记录真实数据并对比
- 成长统计：汇总内容数量、复盘准确度和表现变化
- 本地存储：使用 AsyncStorage 保存数据

## 技术栈

- Expo 54
- React Native 0.76
- expo-router
- NativeWind / Tailwind CSS
- Zustand
- AsyncStorage
- react-native-gifted-charts

## 项目结构

```text
.
├── app/                 # expo-router 页面
│   ├── (tabs)/          # 看板、内容、选题、成长、设置
│   ├── content/         # 内容详情、预测、发布、复盘、评分
│   ├── topic/           # 选题新增和编辑
│   └── onboarding.tsx
├── src/
│   ├── components/      # UI 和业务组件
│   ├── hooks/           # 统计与复盘相关 hooks
│   ├── lib/             # 本地存储
│   ├── store/           # Zustand 状态管理
│   └── utils/           # 日期、评分、准确率等工具
├── package.json
└── README.md
```

## 运行

```bash
npm install
npm run start
```

常用命令：

```bash
npm run android
npm run ios
npm run web
```

## 数据说明

桌面上存在一个本地文件 `星座.xlsx`，看起来是星座相关短视频评论/线索数据，字段包含视频标题、昵称、账号、uid、线索、手机、微信、省市等。

该表包含个人标识和联系方式，不适合提交到公开仓库。本仓库只保留数据用途说明和脱敏字段设计，原始数据继续留在本地。

脱敏后可用于：

- 分析星座类短视频评论线索
- 提取常见问题和高频命中词
- 建立选题灵感库
- 评估星座内容的互动方向

## 后续可做

- 增加 CSV/XLSX 导入功能
- 导入前自动脱敏昵称、账号、uid、手机、微信
- 从评论线索中自动提取选题
- 把线索转为 `Topic` 或 `Content` 草稿
