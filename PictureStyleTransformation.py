#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
TensorFlowを用いて、画風変換を行うプログラム
$ python PictureStyleTransformation.py
"""

__author__ = 'Shingu Katsuyuki'
__version__ = '0.0.1'
__date__ = '2024/2/23 (Created: 2024/2/21)'

import sys
import os

import tensorflow as tf
os.environ['TFHUB_MODEL_LOAD_FORMAT'] = 'COMPRESSED'
import tensorflow_hub as hub

import numpy as np
import PIL.Image

import matplotlib.pyplot as plt
import matplotlib as mpl
mpl.rcParams['figure.figsize'] = (8, 8)
mpl.rcParams['axes.grid'] = False

def tensor_to_image(tensor):
    """
    tensorデータを画像データに変換する
    """
    tensor = tensor*255
    tensor = np.array(tensor, dtype=np.uint8)
    if np.ndim(tensor) > 3:
        assert tensor.shape[0] == 1
        tensor = tensor[0]
    return PIL.Image.fromarray(tensor)

def load_image(path_to_image):
    """
    画像を読み込み、その最大寸法を512ピクセルに制限する
    """
    max_dim = 512
    image = tf.io.read_file(path_to_image)
    image = tf.image.decode_image(image, channels=3)
    image = tf.image.convert_image_dtype(image, tf.float32)

    shape = tf.cast(tf.shape(image)[:-1], tf.float32)
    long_dim = max(shape)
    scale = max_dim / long_dim

    new_shape = tf.cast(shape * scale, tf.int32)

    image = tf.image.resize(image, new_shape)
    image = image[tf.newaxis, :]
    return image

def image_show(image, title=None):
    """
    画像を表示する
    """
    if len(image.shape) > 3:
        image = tf.squeeze(image, axis=0)

    plt.imshow(image)
    if title:
        plt.title(title)

def main():
    """
    TensorFlowを用いて画風変換を行うメインプログラム。
    """
    content_image_directory = os.getcwd() + os.sep + 'contentImages'
    style_image_directory = os.getcwd() + os.sep + 'styleImages'
    content_path = content_image_directory + os.sep + 'fuji.jpg'
    style_path = style_image_directory + os.sep + 'fullMoon.jpg'

    content_image = load_image(content_path)
    style_image = load_image(style_path)

    plt.figure('Input Image')
    plt.subplot(1,2,1)
    image_show(content_image, 'Content Image')
    plt.subplot(1,2,2)
    image_show(style_image, 'Style Image')

    hub_model = hub.load('./archive')
    stylized_image = hub_model(tf.constant(content_image), tf.constant(style_image))[0]
    tensor_to_image(stylized_image)
    plt.figure('Output Image')
    image_show(stylized_image, 'Stylized Image')
    plt.show()

    return 0

if __name__ == '__main__':
	# このモジュールのmain()を呼び出し、結果を得て、Pythonシステムに終わりを告げます。
    sys.exit(main())
