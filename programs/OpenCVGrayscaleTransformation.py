#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
OpenCVを用いてグレースケール変換を行うプログラム
$ python OpenCVGrayscaleTransformation.py
"""

__author__ = 'Shingu Katsuyuki'
__version__ = '0.0.1'
__date__ = '2024/2/5 (Created: 2024/2/3)'

import sys
# import os

import cv2

def grayscale_transformation(file_name):
    """
    入力された画像ファイルをグレースケール変換する。
    """
    image = cv2.imread(file_name)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    cv2.imshow('Image', gray_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def main():
    """
    OpenCVを用いて画像変換を行うメインプログラム。
    """
    # current_directory = os.getcwd()
    # image_name = current_directory + os.sep + 'sample.png'
    if len(sys.argv) == 2:
        image_name = sys.argv[1]
    else:
        print("以下のように実行してください。")
        print("$ python OpenCVGrayscaleTransformation.py (画像ファイル名)")
        return 1

    grayscale_transformation(image_name)

    return 0

if __name__ == '__main__':
	# このモジュールのmain()を呼び出し、結果を得て、Pythonシステムに終わりを告げます。
    sys.exit(main())
