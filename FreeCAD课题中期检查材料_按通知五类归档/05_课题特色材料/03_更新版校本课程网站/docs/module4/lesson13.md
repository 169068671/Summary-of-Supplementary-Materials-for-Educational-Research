# 📍 第 13 课：数据录入舱（QLineEdit 文本与数值转换）

> 输入框得到的是文字，必须转换成数字后才能用于建模。

## 本课要完成什么

1. 用自己的话说清楚：输入框得到的是文字，必须转换成数字后才能用于建模。
2. 看懂并计算：数字 = float（输入框文字）
3. 运行一段最小代码，完成：输入半径创建球体

## 先把关系说成人话

**数量关系：** 数字 = float（输入框文字）

**怎么理解：** 先读文字，再转为小数；转换失败时要给出提示。

**数字例子：** 输入“15.5”→ 转换为15.5 → 创建半径15.5毫米的球体。

**生活类比：** 文字“15”不能直接参加几何计算，要先变成数值15。

## 已验证的课堂最小代码

下面的代码聚焦本课核心知识点，适用于带 Python 控制台的 FreeCAD 桌面版。

```python
import FreeCAD as App
import Part
from PySide import QtWidgets

doc = App.newDocument("Lesson13")

def create_sphere():
    try:
        radius = float(input_box.text())
        if radius <= 0:
            raise ValueError
        sphere = doc.addObject("Part::Feature", "Sphere")
        sphere.Shape = Part.makeSphere(radius)
        message.setText("已创建半径 %.1f mm 的球体" % radius)
        doc.recompute()
        Gui.activeDocument().activeView().fitAll()
    except ValueError:
        message.setText("请输入大于0的数字")

panel = QtWidgets.QWidget()
layout = QtWidgets.QVBoxLayout(panel)
input_box = QtWidgets.QLineEdit("15")
button = QtWidgets.QPushButton("创建球体")
message = QtWidgets.QLabel()
button.clicked.connect(create_sphere)
layout.addWidget(input_box)
layout.addWidget(button)
layout.addWidget(message)
panel.show()
```

## 按这五步运行

1. 打开FreeCAD，新建文档。
2. 打开“视图 → 面板 → Python控制台”。
3. 输入 `15.5` 并点击按钮，确认生成对应半径的球体。
4. 输入汉字或负数，确认界面显示错误提示且不会建模。
5. 记录“改了什么、结果怎样、为什么会变”。

## 常见问题

- 输入空白或汉字导致转换失败
- 没有限制数值范围
- 转换异常没有提示用户

## 分层任务

### 基础任务

输入半径创建球体

### 进阶任务

增加高度输入框创建圆柱

### 创意任务

加入错误提示和默认值

## 下课前检查

- [ ] 我能用一句话解释本课原理。
- [ ] 我能指出代码中最关键的参数。
- [ ] 我只修改一个参数并比较了结果。
- [ ] 我保存了模型文件、截图和一句话说明。
