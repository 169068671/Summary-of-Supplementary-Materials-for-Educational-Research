# 第17课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

import FreeCAD as App
import Part

doc = App.newDocument("Lesson17")
curve = Part.BSplineCurve()
points = [App.Vector(0,0,0), App.Vector(20,20,0),
          App.Vector(40,0,0)]
curve.interpolate(points)
path = doc.addObject("Part::Feature", "Path")
path.Shape = curve.toShape()
doc.recompute()
