# 第09课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

import math
import FreeCAD as App
import Part

doc = App.newDocument("Lesson09")
points = [App.Vector(x, 0, 5*math.sin(math.radians(x*12)))
          for x in range(31)]
wave = doc.addObject("Part::Feature", "Wave")
wave.Shape = Part.makePolygon(points)
doc.recompute()
