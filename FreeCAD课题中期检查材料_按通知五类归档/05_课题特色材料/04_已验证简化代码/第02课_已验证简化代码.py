# 第02课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

import FreeCAD as App
import Part

doc = App.newDocument("Lesson02")
box = doc.addObject("Part::Feature", "Box")
box.Shape = Part.makeBox(20, 20, 20)
doc.recompute()
