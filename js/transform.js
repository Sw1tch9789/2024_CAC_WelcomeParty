// 白黒に変換
function transform(imgMat) {
    cv.cvtColor(imgMat, imgMat, cv.COLOR_RGBA2GRAY, 0);
    return imgMat;
}
