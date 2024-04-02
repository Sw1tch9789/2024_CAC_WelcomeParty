// 変換idと、変換名・変換処理のマッピング
const transformMap = {
    'transform-grayscale': ['グレースケール', transformGrayScale],
    'transform-face': ['顔認識', transformFace],
    'transform-tfjs': ['TensorFlow.js', transformTfjs],
};

// 白黒に変換
function transformGrayScale(srcImgElt, resultImgElt) {
    let imgMat = cv.imread(srcImgElt);
    cv.cvtColor(imgMat, imgMat, cv.COLOR_RGBA2GRAY, 0);
    cv.imshow(resultImgElt, imgMat);
    imgMat.delete();
}

// 顔を検出
function transformFace(srcImgElt, resultImgElt) {
    let src = cv.imread(srcImgElt);
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    let faces = new cv.RectVector();
    let eyes = new cv.RectVector();
    let faceCascade = new cv.CascadeClassifier();
    let eyeCascade = new cv.CascadeClassifier();
    // load pre-trained classifiers
    faceCascade.load('haarcascade_frontalface_default.xml');
    eyeCascade.load('haarcascade_eye.xml');
    // detect faces
    let msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
    for (let i = 0; i < faces.size(); ++i) {
        let roiGray = gray.roi(faces.get(i));
        let roiSrc = src.roi(faces.get(i));
        let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
        let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
            faces.get(i).y + faces.get(i).height);
        cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        // detect eyes in face ROI
        eyeCascade.detectMultiScale(roiGray, eyes);
        for (let j = 0; j < eyes.size(); ++j) {
            let point1 = new cv.Point(eyes.get(j).x, eyes.get(j).y);
            let point2 = new cv.Point(eyes.get(j).x + eyes.get(j).width,
                eyes.get(j).y + eyes.get(j).height);
            cv.rectangle(roiSrc, point1, point2, [0, 0, 255, 255]);
        }
        roiGray.delete(); roiSrc.delete();
    }
    cv.imshow(resultImgElt, src);
    src.delete(); gray.delete(); faceCascade.delete();
    eyeCascade.delete(); faces.delete(); eyes.delete();
}

function transformTfjs(srcImgElt, resultImgElt) {
    // 画像をTensorFlow.jsのテンソルに変換
    let image = tf.browser.fromPixels(srcImgElt, 1);
    // 画像を表示
    tf.browser.toPixels(image, resultImgElt);
}
