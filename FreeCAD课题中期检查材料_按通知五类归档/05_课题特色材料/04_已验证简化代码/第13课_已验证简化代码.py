# 第13课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

from PySide import QtWidgets

box = QtWidgets.QLineEdit("15")
radius = float(box.text())
print("半径：", radius)
box.show()
