# 📍 第 17 课：轨迹追踪（B-Spline 与路径运动）

> 路径运动先定义一条曲线，再用0到1的进度取得曲线上的位置。

## 本课要完成什么

1. 用自己的话说清楚：路径运动先定义一条曲线，再用0到1的进度取得曲线上的位置。
2. 看懂并计算：当前位置 = 曲线在进度t处的点，t从0增加到1
3. 运行一段最小代码，完成：创建一条B样条路径

## 先把关系说成人话

**数量关系：** 当前位置 = 曲线在进度t处的点，t从0增加到1

**怎么理解：** t=0在起点，t=0.5在中间附近，t=1在终点。

**数字例子：** 每次让t增加0.02，大约50次更新完成整条路径。

**生活类比：** 火车沿轨道前进，轨道决定方向，进度决定位置。

## 已验证的课堂最小代码

下面的代码聚焦本课核心知识点，适用于带 Python 控制台的 FreeCAD 桌面版。

```python
import FreeCAD as App
import Part

doc = App.newDocument("Lesson17")
curve = Part.BSplineCurve()
points = [App.Vector(0,0,0), App.Vector(20,20,0),
          App.Vector(40,0,0)]
curve.interpolate(points)
path = doc.addObject("Part::Feature", "Path")
path.Shape = curve.toShape()

# 曲线的实际参数范围不一定是0到1，先把进度t映射到参数范围
t = 0.5
first, last = curve.FirstParameter, curve.LastParameter
parameter = first + t * (last - first)
marker = doc.addObject("Part::Feature", "PositionAtT")
marker.Shape = Part.makeSphere(2, curve.value(parameter))
doc.recompute()
```

## 按这五步运行

1. 打开FreeCAD，新建文档。
2. 打开“视图 → 面板 → Python控制台”。
3. 先原样运行代码，确认出现B样条路径和位于路径中段附近的小球。
4. 分别把 `t` 改成 `0`、`0.25`、`0.75`、`1`，比较小球位置。
5. 记录“改了什么、结果怎样、为什么会变”。

## 常见问题

- 控制点太少曲线不自然
- t超过1后没有重置
- 只更新位置没有刷新视图

## 分层任务

### 基础任务

创建一条B样条路径

### 进阶任务

让小球沿路径运动

### 创意任务

改变控制点比较轨迹

## 下课前检查

- [ ] 我能用一句话解释本课原理。
- [ ] 我能指出代码中最关键的参数。
- [ ] 我只修改一个参数并比较了结果。
- [ ] 我保存了模型文件、截图和一句话说明。
