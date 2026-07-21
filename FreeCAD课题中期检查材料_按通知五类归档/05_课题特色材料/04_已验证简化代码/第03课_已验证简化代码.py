# 第03课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

import FreeCAD as App
import Part

radius = 10
height = 30
doc = App.newDocument("Lesson03")
cylinder = doc.addObject("Part::Feature", "Cylinder")
cylinder.Shape = Part.makeCylinder(radius, height)
doc.recompute()
