# 🐛 常见Bug修复秘籍

作为高中生，在实现过程中一定会遇到Bug。这份文档记录了我们在教学和开发过程中收集的"血泪史"。

---

## 1. 缩进错误 (IndentationError)

**症状**：代码一运行就红字报错

```
IndentationError: unexpected indent
```

**原因**：Python是靠缩进认"一家人"的

**解药**：
- 检查 `for` 循环和 `if` 语句下面是不是严格空了4个空格
- **不要混用Tab和空格！**
- 建议：统一使用4个空格

**正确示例**：
```python
# ✅ 正确
for i in range(5):
    print(i)  # 4个空格缩进
    Part.show(box)  # 同样在循环内

# ❌ 错误
for i in range(5):
    print(i)
      Part.show(box)  # 缩进不一致！
```

---

## 2. FreeCAD 卡死/未响应

**症状**：运行代码后 FreeCAD 无响应

**原因**：
- 写了死循环 `while True:` 且没有跳出条件
- 生成的阵列数量太大（如 `range(10000)`）

**解药**：
- 在写动画或密集计算时，使用 `QTimer` 而不是 `while` 循环
- 控制循环次数，先测试小参数

**正确示例**：
```python
# ✅ 正确：使用定时器
from PySide import QtCore

timer = QtCore.QTimer()
timer.timeout.connect(update_function)
timer.start(50)

# ❌ 错误：死循环
while True:
    update_function()  # 会卡死！
```

---

## 3. GUI 窗口闪退

**症状**：写了UI代码，运行后窗口闪了一下就不见了

**原因**：变量被垃圾回收了

**解药**：确保窗口实例是一个全局变量

**正确示例**：
```python
# ✅ 正确：全局变量
my_gui = MyWindow()
my_gui.show()

# ❌ 错误：局部变量（会闪退）
def show_window():
    gui = MyWindow()  # 函数结束就被销毁
    gui.show()
```

---

## 4. 对象未找到错误

**症状**：
```
AttributeError: 'NoneType' object has no attribute 'Shape'
```

**原因**：尝试访问不存在的对象

**解药**：检查对象名称是否正确，确保对象存在

**正确示例**：
```python
# ✅ 正确：先检查对象是否存在
obj = App.ActiveDocument.getObject("MyBox")
if obj:
    print(obj.Shape)
else:
    print("对象不存在！")

# ❌ 错误：直接访问可能不存在的对象
obj = App.ActiveDocument.getObject("MyBox")
print(obj.Shape)  # 如果obj为None会报错
```

---

## 5. 数值转换错误

**症状**：
```
ValueError: could not convert string to float: 'abc'
```

**原因**：试图将非数字字符串转换为数字

**解药**：使用 try-except 捕获异常

**正确示例**：
```python
# ✅ 正确：错误处理
try:
    radius = float(input_text)
except ValueError:
    print("请输入有效的数字！")

# ❌ 错误：直接转换
radius = float(input_text)  # 如果input_text是"abc"会报错
```

---

## 6. 视图不更新

**症状**：代码运行了，但3D视图没有变化

**原因**：忘记调用 `recompute()`

**解药**：修改模型后刷新视图

**正确示例**：
```python
# ✅ 正确：刷新视图
obj.Shape = new_shape
App.ActiveDocument.recompute()

# ❌ 错误：不刷新
obj.Shape = new_shape  # 视图不会更新！
```

---

## 7. 中文显示乱码

**症状**：中文字符显示为乱码或方框

**解药**：在文件开头添加编码声明

```python
# -*- coding: utf-8 -*-
```

或者在字符串前加 `u`：
```python
print(u"你好，FreeCAD！")
```

---

## 8. 模块导入错误

**症状**：
```
ImportError: No module named 'xxx'
```

**原因**：模块名称错误或模块未安装

**解药**：检查模块名称拼写，FreeCAD内置模块包括：
- `FreeCAD` / `App`
- `Part`
- `Draft`
- `PySide`

---

## Debug 技巧

### 1. 使用 print 输出调试信息

```python
print(f"当前半径：{radius}")
print(f"对象位置：{obj.Placement.Base}")
```

### 2. 使用 FreeCAD 控制台

```python
App.Console.PrintMessage("调试信息\n")
App.Console.PrintError("错误信息\n")
```

### 3. 分段测试

将复杂代码分成小段，逐段测试

### 4. 查看文档

FreeCAD Python API 文档：https://wiki.freecad.org/FreeCAD_API

---

## 求助渠道

遇到问题不要慌：

1. **重新阅读课程文档**
2. **检查代码缩进和标点**
3. **搜索错误信息**
4. **询问老师或同学**
5. **在课程论坛发帖**

记住：**每一个Bug都是学习的机会！**
