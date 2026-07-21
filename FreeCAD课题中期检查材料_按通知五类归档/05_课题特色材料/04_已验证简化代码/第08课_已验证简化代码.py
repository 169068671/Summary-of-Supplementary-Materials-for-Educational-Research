# 第08课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

import FreeCAD as App
import Part

doc = App.newDocument("Lesson08")
def make_box(size):
    box = doc.addObject("Part::Feature", "Box")
    box.Shape = Part.makeBox(size, size, size)
    return box

make_box(15)
doc.recompute()
