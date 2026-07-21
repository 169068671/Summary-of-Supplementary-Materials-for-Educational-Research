# 📍 第 5 课：秩序的阵列（for 循环与线性构建）

> 循环让计算机重复做事，循环变量决定每次的位置差。

## 本课要完成什么

1. 用自己的话说清楚：循环让计算机重复做事，循环变量决定每次的位置差。
2. 看懂并计算：第n个位置 = 第1个位置 +（n－1）× 间距
3. 运行一段最小代码，完成：把5级台阶改成10级

## 先把关系说成人话

**数量关系：** 第n个位置 = 第1个位置 +（n－1）× 间距

**怎么理解：** 序号每增加1，位置就增加一个固定间距。

**数字例子：** 间距10毫米：第1级0，第2级10，第3级20，第4级30，第5级40。

**生活类比：** 等差数列就是均匀排列的数学说明书。

## 已验证的课堂最小代码

下面的代码聚焦本课核心知识点，适用于带 Python 控制台的 FreeCAD 桌面版。

```python
import FreeCAD as App
import Part

step_count = 5
step_width = 20
step_depth = 30
step_height = 5

doc = App.newDocument("Lesson05")
for i in range(step_count):
    step = doc.addObject("Part::Feature", "Step%02d" % (i + 1))
    step.Shape = Part.makeBox(step_width, step_depth, step_height)
    step.Placement.Base = App.Vector(i * step_width, 0, i * step_height)
doc.recompute()
```

## 按这五步运行

1. 打开FreeCAD，新建文档。
2. 打开“视图 → 面板 → Python控制台”。
3. 先原样运行代码，确认出现5级逐级升高的台阶。
4. 把 `step_count` 从5改成10，再运行一次。
5. 记录“改了什么、结果怎样、为什么会变”。

## 常见问题

- range(5)误以为会得到1到5
- 循环内部没有缩进
- 间距小于物体尺寸导致重叠

## 分层任务

### 基础任务

把5级台阶改成10级

### 进阶任务

改变每级高度

### 创意任务

用双重循环做3×3阵列

## 下课前检查

- [ ] 我能用一句话解释本课原理。
- [ ] 我能指出代码中最关键的参数。
- [ ] 我只修改一个参数并比较了结果。
- [ ] 我保存了模型文件、截图和一句话说明。
