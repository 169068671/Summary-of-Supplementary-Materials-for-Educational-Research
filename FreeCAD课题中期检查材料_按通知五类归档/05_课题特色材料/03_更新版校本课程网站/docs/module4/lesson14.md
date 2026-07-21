# 📍 第 14 课：我的定制工坊（GUI网格布局设计）

> 网格布局用“第几行、第几列”安排控件，界面会更整齐。

## 本课要完成什么

1. 用自己的话说清楚：网格布局用“第几行、第几列”安排控件，界面会更整齐。
2. 看懂并计算：控件位置 =（行号，列号）
3. 运行一段最小代码，完成：完成2行2列参数面板

## 先把关系说成人话

**数量关系：** 控件位置 =（行号，列号）

**怎么理解：** 同一行横向排列，同一列纵向对齐。

**数字例子：** 名称标签放(0,0)，输入框放(0,1)，按钮横跨第2行两列。

**生活类比：** 像教室座位表，每个控件都有行列位置。

## 已验证的课堂最小代码

下面的代码聚焦本课核心知识点，适用于带 Python 控制台的 FreeCAD 桌面版。

```python
from PySide import QtWidgets

panel = QtWidgets.QWidget()
layout = QtWidgets.QGridLayout(panel)
layout.addWidget(QtWidgets.QLabel("半径"), 0, 0)
radius_input = QtWidgets.QLineEdit("10")
layout.addWidget(radius_input, 0, 1)
layout.addWidget(QtWidgets.QLabel("高度"), 1, 0)
height_input = QtWidgets.QLineEdit("30")
layout.addWidget(height_input, 1, 1)
button = QtWidgets.QPushButton("生成圆柱")
layout.addWidget(button, 2, 0, 1, 2)
panel.show()
```

## 按这五步运行

1. 打开FreeCAD，新建文档。
2. 打开“视图 → 面板 → Python控制台”。
3. 先原样运行代码，确认半径和高度控件按2行2列对齐。
4. 确认“生成圆柱”按钮横跨最下面两列。
5. 记录“改了什么、结果怎样、为什么会变”。

## 常见问题

- 多个控件放在同一单元格
- 行列编号写反
- 控件没有加入布局

## 分层任务

### 基础任务

完成2行2列参数面板

### 进阶任务

让按钮横跨两列

### 创意任务

增加结果提示标签

## 下课前检查

- [ ] 我能用一句话解释本课原理。
- [ ] 我能指出代码中最关键的参数。
- [ ] 我只修改一个参数并比较了结果。
- [ ] 我保存了模型文件、截图和一句话说明。
