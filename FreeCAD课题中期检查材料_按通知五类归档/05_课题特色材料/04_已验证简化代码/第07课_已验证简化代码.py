# 第07课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

import FreeCAD as App
import Part

doc = App.newDocument("Lesson07")
points = [App.Vector(0,0,0), App.Vector(20,0,0),
          App.Vector(20,20,0)]
line = doc.addObject("Part::Feature", "Line")
line.Shape = Part.makePolygon(points)
doc.recompute()
