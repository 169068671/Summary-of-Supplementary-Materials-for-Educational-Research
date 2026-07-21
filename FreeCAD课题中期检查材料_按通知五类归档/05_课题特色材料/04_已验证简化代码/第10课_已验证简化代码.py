# 第10课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

import FreeCAD as App
import Part

doc = App.newDocument("Lesson10")
for x in range(3):
    for y in range(3):
        if not (x == 1 and y == 1):
            box = doc.addObject("Part::Feature", "Box")
            box.Shape = Part.makeBox(8, 8, 2)
            box.Placement.Base = App.Vector(x*10, y*10, 0)
doc.recompute()
