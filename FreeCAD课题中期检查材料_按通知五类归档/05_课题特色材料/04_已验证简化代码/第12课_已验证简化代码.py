# 第12课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

from PySide import QtCore, QtWidgets

slider = QtWidgets.QSlider(QtCore.Qt.Horizontal)
slider.setRange(5, 50)
slider.setValue(20)
slider.show()
