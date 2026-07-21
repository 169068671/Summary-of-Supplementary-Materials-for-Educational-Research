# 📍 第 16 课：空间碰撞（AABB 边界框干涉检测）

> AABB用与坐标轴平行的盒子快速判断两个物体是否可能相撞。

## 本课要完成什么

1. 用自己的话说清楚：AABB用与坐标轴平行的盒子快速判断两个物体是否可能相撞。
2. 看懂并计算：三个方向都发生重叠，才判定为碰撞
3. 运行一段最小代码，完成：移动方块触发碰撞提示

## 先把关系说成人话

**数量关系：** 三个方向都发生重叠，才判定为碰撞

**怎么理解：** 分别检查X、Y、Z范围；任何一个方向分开，都没有碰撞。

**数字例子：** 物体A的X范围0到20，B的X范围15到35：X方向重叠5毫米。

**生活类比：** 先看两个快递盒的外包装是否相交，再决定是否精确检查。

## 已验证的课堂最小代码

下面的代码聚焦本课核心知识点，适用于带 Python 控制台的 FreeCAD 桌面版。

```python
import FreeCAD as App
import Part

doc = App.newDocument("Lesson16")
a = doc.addObject("Part::Feature", "FixedBox")
b = doc.addObject("Part::Feature", "MovingBox")
a.Shape = Part.makeBox(20, 20, 20)

move_x = 15
b.Shape = Part.makeBox(20, 20, 20, App.Vector(move_x, 0, 0))
doc.recompute()

is_collision = a.Shape.BoundBox.intersect(b.Shape.BoundBox)
b.ViewObject.ShapeColor = (1.0, 0.2, 0.2) if is_collision else (0.2, 0.8, 0.2)
print("是否碰撞：", is_collision)
Gui.activeDocument().activeView().fitAll()
```

## 按这五步运行

1. 打开FreeCAD，新建文档。
2. 打开“视图 → 面板 → Python控制台”。
3. 先原样运行代码，确认移动方块与固定方块重叠并显示红色。
4. 把 `move_x` 改为 `25`，确认两个方块分开且显示绿色。
5. 记录“改了什么、结果怎样、为什么会变”。

## 常见问题

- 只检查一个方向
- 把最小值和最大值写反
- 移动物体后没有更新边界框

## 分层任务

### 基础任务

移动方块触发碰撞提示

### 进阶任务

用颜色表示碰撞状态

### 创意任务

增加第三个障碍物

## 下课前检查

- [ ] 我能用一句话解释本课原理。
- [ ] 我能指出代码中最关键的参数。
- [ ] 我只修改一个参数并比较了结果。
- [ ] 我保存了模型文件、截图和一句话说明。
