# 第05课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

import FreeCAD as App
import Part

doc = App.newDocument("Lesson05")
for i in range(5):
    box = doc.addObject("Part::Feature", "Box")
    box.Shape = Part.makeBox(8, 8, 8)
    box.Placement.Base.x = i * 12
doc.recompute()
