# 📍 第 19 课：虚实跨越（切片策略与打印支撑）

> 切片把模型分成很多薄层；支撑用于托住悬空或大角度外伸部分。

## 本课要完成什么

1. 用自己的话说清楚：切片把模型分成很多薄层；支撑用于托住悬空或大角度外伸部分。
2. 看懂并计算：打印层数 = 模型高度 ÷ 层高
3. 运行一段最小代码，完成：导出STL并导入Cura

## 先把关系说成人话

**数量关系：** 打印层数 = 模型高度 ÷ 层高

**怎么理解：** 层高越小，层数越多，表面更细，但打印更久。

**数字例子：** 模型高30毫米，层高0.2毫米：30÷0.2=150层。

**生活类比：** 像把一本厚书拆成很多薄纸页，再逐页打印。

## 已验证的课堂最小代码

下面的代码聚焦本课核心知识点，适用于带 Python 控制台的 FreeCAD 桌面版。

```python
import FreeCAD as App
import Part
import Mesh
import os

doc = App.newDocument("Lesson19")
model = doc.addObject("Part::Feature", "PrintModel")
model.Shape = Part.makeBox(20, 20, 10)
doc.recompute()
print("模型有效：", model.Shape.isValid())
print("模型封闭：", model.Shape.isClosed())

output_path = os.path.join(os.path.expanduser("~"), "Desktop", "Lesson19.stl")
Mesh.export([model], output_path)
print("STL已导出到：", output_path)
```

## 按这五步运行

1. 打开FreeCAD，新建文档。
2. 打开“视图 → 面板 → Python控制台”。
3. 先原样运行代码，确认模型有效、封闭，并在桌面生成 `Lesson19.stl`。
4. 将STL导入切片软件，检查尺寸是否为20×20×10毫米。
5. 记录“改了什么、结果怎样、为什么会变”。

## 常见问题

- STL单位或比例错误
- 没有检查模型是否封闭
- 支撑过多难拆，过少会塌陷

## 分层任务

### 基础任务

导出STL并导入Cura

### 进阶任务

比较0.2与0.1层高

### 创意任务

调整摆放方向减少支撑

## 下课前检查

- [ ] 我能用一句话解释本课原理。
- [ ] 我能指出代码中最关键的参数。
- [ ] 我只修改一个参数并比较了结果。
- [ ] 我保存了模型文件、截图和一句话说明。
