# 🔧 环境搭建指南

本指南将帮助你搭建"代码造物"课程所需的开发环境。

---

## 系统要求

| 项目 | 最低配置 | 推荐配置 |
|:---|:---|:---|
| 操作系统 | Windows 7 / macOS 10.12 / Ubuntu 16.04 | Windows 10 / macOS 11 / Ubuntu 20.04 |
| 处理器 | 双核 2.0 GHz | 四核 3.0 GHz |
| 内存 | 4 GB | 8 GB+ |
| 硬盘空间 | 2 GB | 5 GB+ |
| 显卡 | 支持OpenGL 2.0 | 支持OpenGL 3.2+ |

---

## 安装 FreeCAD

### Windows

1. 访问官网：https://www.freecad.org/
2. 点击 "Download" 按钮
3. 下载 Windows 安装程序（.exe）
4. 运行安装程序，按提示完成安装
5. 启动 FreeCAD

### macOS

1. 访问官网：https://www.freecad.org/
2. 下载 macOS 版本（.dmg）
3. 打开 .dmg 文件
4. 将 FreeCAD 拖入 Applications 文件夹
5. 从 Applications 启动 FreeCAD

### Linux (Ubuntu)

```bash
# 通过 PPA 安装最新版本
sudo add-apt-repository ppa:freecad-maintainers/freecad-stable
sudo apt update
sudo apt install freecad

# 启动
freecad
```

---

## 配置 FreeCAD

### 第一步：切换工作台

1. 启动 FreeCAD
2. 在顶部工具栏的下拉菜单中
3. 选择 `Part`（零件）工作台

### 第二步：调出 Python 控制台

1. 点击顶部菜单栏 `视图 (View)`
2. 选择 `面板 (Panels)`
3. 勾选以下面板：
   - ✅ `Python 控制台 (Python console)`
   - ✅ `报告视图 (Report view)`

### 第三步：验证安装

在 Python 控制台中输入：

```python
import FreeCAD as App
App.Console.PrintMessage("Hello, FreeCAD!\n")
```

如果看到输出，说明安装成功！

---

## 安装切片软件（可选）

### Cura

1. 访问：https://ultimaker.com/software/ultimaker-cura
2. 下载并安装
3. 配置你的3D打印机参数

### PrusaSlicer

1. 访问：https://www.prusa3d.com/prusaslicer/
2. 下载并安装
3. 选择打印机型号

---

## 常见问题

### Q: FreeCAD 启动很慢？

A: 首次启动需要加载模块，耐心等待。后续启动会更快。

### Q: Python 控制台不显示？

A: 检查是否勾选了 `视图 → 面板 → Python 控制台`。如果还不显示，尝试重置窗口布局：`视图 → 视图模式 → 默认`。

### Q: 代码运行报错？

A: 检查：
1. 是否在正确的文档中运行
2. 代码缩进是否正确
3. 标点符号是否为英文半角

---

## 下一步

环境搭建完成！现在可以开始学习 [第1课：造物新纪元](../module1/lesson01.html) 了。
