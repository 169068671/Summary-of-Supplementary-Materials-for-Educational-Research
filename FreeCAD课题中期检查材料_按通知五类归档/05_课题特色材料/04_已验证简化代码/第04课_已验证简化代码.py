# 第04课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

import FreeCAD as App
import Part

doc = App.newDocument("Lesson04")
box = doc.addObject("Part::Feature", "MovedBox")
box.Shape = Part.makeBox(10, 10, 10)
box.Placement.Base = App.Vector(30, 0, 0)
doc.recompute()
