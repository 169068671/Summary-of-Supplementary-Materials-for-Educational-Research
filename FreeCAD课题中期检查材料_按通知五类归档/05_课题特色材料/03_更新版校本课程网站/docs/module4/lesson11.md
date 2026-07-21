# 📍 第 11 课：告别黑框（PySide 基础与按钮）

> GUI程序平时等待事件，点击按钮后才执行对应函数。

## 本课要完成什么

1. 用自己的话说清楚：GUI程序平时等待事件，点击按钮后才执行对应函数。
2. 看懂并计算：用户点击 → 触发事件 → 执行回调函数
3. 运行一段最小代码，完成：创建一个窗口和按钮

## 先把关系说成人话

**数量关系：** 用户点击 → 触发事件 → 执行回调函数

**怎么理解：** 按钮只负责发出事件，真正的模型操作写在函数里。

**数字例子：** 点击“创建球体”，回调函数读取参数并在FreeCAD中生成对象。

**生活类比：** 门铃被按下后，铃声程序才开始工作。

## 已验证的课堂最小代码

下面的代码聚焦本课核心知识点，适用于带 Python 控制台的 FreeCAD 桌面版。

```python
import FreeCAD as App
import Part
from PySide import QtWidgets

doc = App.newDocument("Lesson11")

def create_box():
    box = doc.addObject("Part::Feature", "Box")
    box.Shape = Part.makeBox(20, 20, 20)
    doc.recompute()
    Gui.activeDocument().activeView().fitAll()

window = QtWidgets.QWidget()
window.setWindowTitle("我的第一个造物窗口")
layout = QtWidgets.QVBoxLayout(window)
button = QtWidgets.QPushButton("创建方块")
button.clicked.connect(create_box)
layout.addWidget(button)
window.show()
```

## 按这五步运行

1. 打开FreeCAD，新建文档。
2. 打开“视图 → 面板 → Python控制台”。
3. 先原样运行代码，确认出现窗口和“创建方块”按钮。
4. 点击按钮，确认FreeCAD视图中生成方块。
5. 记录“改了什么、结果怎样、为什么会变”。

## 常见问题

- 按钮没有连接回调函数
- 窗口创建后没有show
- 把模型代码写在错误作用域

## 分层任务

### 基础任务

创建一个窗口和按钮

### 进阶任务

点击按钮生成球体

### 创意任务

修改按钮文字并增加颜色

## 下课前检查

- [ ] 我能用一句话解释本课原理。
- [ ] 我能指出代码中最关键的参数。
- [ ] 我只修改一个参数并比较了结果。
- [ ] 我保存了模型文件、截图和一句话说明。
