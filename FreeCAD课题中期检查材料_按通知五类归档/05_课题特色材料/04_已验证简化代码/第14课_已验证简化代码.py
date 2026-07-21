# 第14课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

from PySide import QtWidgets

panel = QtWidgets.QWidget()
layout = QtWidgets.QGridLayout(panel)
layout.addWidget(QtWidgets.QLabel("半径"), 0, 0)
layout.addWidget(QtWidgets.QLineEdit("10"), 0, 1)
panel.show()
