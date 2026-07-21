# 📍 第 12 课：维度控制器（QSlider 滑动条交互）

> 滑动条把有限范围的整数映射为模型尺寸或角度。

## 本课要完成什么

1. 用自己的话说清楚：滑动条把有限范围的整数映射为模型尺寸或角度。
2. 看懂并计算：模型值 = 最小值 + 滑块比例 ×（最大值－最小值）
3. 运行一段最小代码，完成：滑块控制球体半径

## 先把关系说成人话

**数量关系：** 模型值 = 最小值 + 滑块比例 ×（最大值－最小值）

**怎么理解：** 先把滑块位置换成0到1的比例，再映射到实际尺寸。

**数字例子：** 滑块50%，尺寸范围10到100：模型值=10+0.5×90=55。

**生活类比：** 音量条改变声音大小，尺寸条改变模型参数。

## 已验证的课堂最小代码

下面的代码聚焦本课核心知识点，适用于带 Python 控制台的 FreeCAD 桌面版。

```python
import FreeCAD as App
import Part
from PySide import QtCore, QtWidgets

doc = App.newDocument("Lesson12")
sphere = doc.addObject("Part::Feature", "Sphere")

def update_radius(value):
    sphere.Shape = Part.makeSphere(value)
    value_label.setText("当前半径：%d mm" % value)
    doc.recompute()
    Gui.activeDocument().activeView().fitAll()

panel = QtWidgets.QWidget()
layout = QtWidgets.QVBoxLayout(panel)
value_label = QtWidgets.QLabel()
slider = QtWidgets.QSlider(QtCore.Qt.Horizontal)
slider.setRange(5, 50)
slider.setValue(20)
slider.valueChanged.connect(update_radius)
layout.addWidget(value_label)
layout.addWidget(slider)
update_radius(slider.value())
panel.show()
```

## 按这五步运行

1. 打开FreeCAD，新建文档。
2. 打开“视图 → 面板 → Python控制台”。
3. 先原样运行代码，确认出现球体、数值标签和滑动条。
4. 拖动滑块，确认球体半径和标签数值同步变化。
5. 记录“改了什么、结果怎样、为什么会变”。

## 常见问题

- 没有设置滑块范围
- 信号连接错误
- 每次变化都重复创建新对象

## 分层任务

### 基础任务

滑块控制球体半径

### 进阶任务

增加数值标签显示当前尺寸

### 创意任务

让滑块控制位置而不是大小

## 下课前检查

- [ ] 我能用一句话解释本课原理。
- [ ] 我能指出代码中最关键的参数。
- [ ] 我只修改一个参数并比较了结果。
- [ ] 我保存了模型文件、截图和一句话说明。
