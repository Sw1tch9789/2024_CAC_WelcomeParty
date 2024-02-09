import cv2

path = "peaple2.jpg"

#画像の読み込み
img = cv2.imread(path)

#グレースケール化 ← ある程度のノイズを除去するため
img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#学習済みモデルの読み込み
cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

#顔の検出  
lists = cascade.detectMultiScale(img_gray, minSize=(100, 100))

#検出した顔の位置を表示
if len(lists):
    for(x, y, w, h) in lists:
        cv2.rectangle(img, (x, y), (x+w, y+h), (0, 0, 255), thickness=2)
    cv2.imshow('img', img)
    cv2.waitKey(0)
else:
    print('nothing')
