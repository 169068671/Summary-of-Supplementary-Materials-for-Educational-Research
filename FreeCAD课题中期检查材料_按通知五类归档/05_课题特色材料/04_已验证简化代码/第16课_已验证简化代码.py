# 第16课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

import FreeCAD as App
import Part

a = Part.makeBox(20, 20, 20).BoundBox
b = Part.makeBox(20, 20, 20,
                 App.Vector(15, 0, 0)).BoundBox
print("是否碰撞：", a.intersect(b))
