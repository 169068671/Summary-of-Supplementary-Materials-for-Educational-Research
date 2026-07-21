# 📍 第 8 课：封装造物术（def 函数与模块化设计）

> 函数把一组步骤封装成可重复调用的造物工具。

## 本课要完成什么

1. 用自己的话说清楚：函数把一组步骤封装成可重复调用的造物工具。
2. 看懂并计算：输出模型 = 函数（输入参数）
3. 运行一段最小代码，完成：调用函数创建一个带孔方块

## 先把关系说成人话

**数量关系：** 输出模型 = 函数（输入参数）

**怎么理解：** 参数决定尺寸，函数负责按固定流程创建模型。

**数字例子：** make_hollow_box(40,5)表示创建边长40、孔半径5的空心方块。

**生活类比：** 函数像模具：换参数，不换制造流程。

## 已验证的课堂最小代码

下面的代码聚焦本课核心知识点，适用于带 Python 控制台的 FreeCAD 桌面版。

```python
import FreeCAD as App
import Part

doc = App.newDocument("Lesson08")

def make_hollow_box(size, hole_radius):
    outer = Part.makeBox(size, size, size)
    hole = Part.makeCylinder(
        hole_radius, size,
        App.Vector(size / 2, size / 2, 0)
    )
    result = doc.addObject("Part::Feature", "HollowBox")
    result.Shape = outer.cut(hole)
    return result

make_hollow_box(40, 5)
doc.recompute()
```

## 按这五步运行

1. 打开FreeCAD，新建文档。
2. 打开“视图 → 面板 → Python控制台”。
3. 先原样运行代码，确认出现边长40毫米、中心孔半径5毫米的方块。
4. 一次只修改一个数字，再运行一次。
5. 记录“改了什么、结果怎样、为什么会变”。

## 常见问题

- 定义函数后没有调用
- return缩进位置错误
- 参数顺序与调用不一致

## 分层任务

### 基础任务

调用函数创建一个带孔方块

### 进阶任务

用不同参数创建3个版本

### 创意任务

给函数增加高度参数

## 下课前检查

- [ ] 我能用一句话解释本课原理。
- [ ] 我能指出代码中最关键的参数。
- [ ] 我只修改一个参数并比较了结果。
- [ ] 我保存了模型文件、截图和一句话说明。
