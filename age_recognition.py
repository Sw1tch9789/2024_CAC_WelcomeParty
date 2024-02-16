
import cv2
import numpy as np
from wide_resnet import WideResNet
from pathlib import Path
import align.detect_face
import tensorflow as tf
from scipy import misc
from keras.utils.data_utils import get_file
import os.path as os

img = cv2.imread("input.jpg") #入力画像
img_size = 64

# 性別・年齢を表記する関数
def draw_label(image, point, label, font=cv2.FONT_HERSHEY_SIMPLEX,
               font_scale=1.0, thickness=1):
    size = cv2.getTextSize(label, font, font_scale, thickness)[0]
    x, y = point
    cv2.rectangle(image, (x, y - size[1]), (x + size[0], y), (0,255,255), cv2.FILLED)
    cv2.putText(image, label, point, font, font_scale, (0, 0, 0), thickness, lineType=cv2.LINE_AA)

faces, bb = Face_detection(img, img_size) # 顔検出  
Ages, Genders = age_gender_predict(faces) # 性別・年齢予測

for face in range(len(faces)):        
    cv2.rectangle(img,(bb[face, 0], bb[face, 1]),(bb[face, 2], bb[face, 3]),(0,255,255),10)
    label = "{}, {}".format(int(Ages[face]), "Male" if Genders[face][0] < 0.5 else "Female")
    draw_label(img, (bb[face, 0], bb[face, 1]), label)

# 出力画像の保存        
cv2.imwrite('output.jpg', img)
