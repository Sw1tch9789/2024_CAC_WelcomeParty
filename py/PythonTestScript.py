from pyscript import display
from datetime import datetime

now = datetime.now()
display(f"今は{now:%Y年%m月%d日 %H:%M:%S}です。")
