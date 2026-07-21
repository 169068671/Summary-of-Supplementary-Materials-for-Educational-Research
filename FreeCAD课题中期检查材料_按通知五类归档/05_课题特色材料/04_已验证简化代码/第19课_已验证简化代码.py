# 第19课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

import FreeCAD as App
import Part

doc = App.newDocument("Lesson19")
model = doc.addObject("Part::Feature", "PrintModel")
model.Shape = Part.makeBox(20, 20, 10)
doc.recompute()
print("模型有效：", model.Shape.isValid())
print("模型封闭：", model.Shape.isClosed())
