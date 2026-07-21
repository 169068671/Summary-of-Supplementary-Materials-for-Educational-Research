# 📍 第 15 课：时间循环（QTimer 与自动动画）

> 定时器每隔一小段时间调用函数，连续更新就形成动画。

## 本课要完成什么

1. 用自己的话说清楚：定时器每隔一小段时间调用函数，连续更新就形成动画。
2. 看懂并计算：本次转角 = 角速度 × 时间间隔
3. 运行一段最小代码，完成：让物体连续旋转

## 先把关系说成人话

**数量关系：** 本次转角 = 角速度 × 时间间隔

**怎么理解：** 更新越频繁，动画越平滑；角速度越大，旋转越快。

**数字例子：** 角速度90度/秒，间隔0.1秒：每次转9度。

**生活类比：** 动画不是一次完成，而是很多小变化快速连续播放。

## 已验证的课堂最小代码

下面的代码聚焦本课核心知识点，适用于带 Python 控制台的 FreeCAD 桌面版。

```python
import FreeCAD as App
import Part
from PySide import QtCore

doc = App.newDocument("Lesson15")
box = doc.addObject("Part::Feature", "RotatingBox")
box.Shape = Part.makeBox(20, 20, 20)
doc.recompute()

angle = 0
def rotate_once():
    global angle
    angle = (angle + 9) % 360
    box.Placement.Rotation = App.Rotation(App.Vector(0, 0, 1), angle)
    doc.recompute()

timer = QtCore.QTimer()
timer.setInterval(100)
timer.timeout.connect(rotate_once)
timer.start()
```

## 按这五步运行

1. 打开FreeCAD，新建文档。
2. 打开“视图 → 面板 → Python控制台”。
3. 先原样运行代码，确认方块绕Z轴连续旋转。
4. 把每次增加的 `9` 改为 `3`，比较旋转速度。
5. 记录“改了什么、结果怎样、为什么会变”。

## 常见问题

- 定时器没有启动
- 每次更新角度过大导致跳动
- 对象引用丢失无法更新

## 分层任务

### 基础任务

让物体连续旋转

### 进阶任务

增加开始和暂停按钮

### 创意任务

用滑块控制旋转速度

## 下课前检查

- [ ] 我能用一句话解释本课原理。
- [ ] 我能指出代码中最关键的参数。
- [ ] 我只修改一个参数并比较了结果。
- [ ] 我保存了模型文件、截图和一句话说明。
