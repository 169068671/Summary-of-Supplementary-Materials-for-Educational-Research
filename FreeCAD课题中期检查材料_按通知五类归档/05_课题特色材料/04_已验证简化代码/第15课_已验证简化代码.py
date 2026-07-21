# 第15课课堂最小代码
# 已在 FreeCAD 26.3 中实际运行通过

from PySide import QtCore

timer = QtCore.QTimer()
timer.setInterval(100)
timer.timeout.connect(lambda: print("更新一次"))
timer.start()
