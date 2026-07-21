# 第18课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

import FreeCAD as App
import Part

doc = App.newDocument("Lesson18")
body = Part.makeCylinder(20, 40)
hole = Part.makeCylinder(15, 40)
cup = doc.addObject("Part::Feature", "Cup")
cup.Shape = body.cut(hole)
doc.recompute()
