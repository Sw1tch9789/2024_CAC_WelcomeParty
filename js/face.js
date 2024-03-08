// 白黒に変換
function transform(imgMat) {
    // グレースケール化
    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY);

    // 学習済みモデルの読み込み
    const cascade = new cv.CascadeClassifier();
    cascade.load('haarcascade_frontalface_default.xml');

    // 顔の検出
    const faces = new cv.RectVector();
    cascade.detectMultiScale(imgGray, faces, 1.1, 3, 0, new cv.Size(100, 100), new cv.Size(0, 0));

    // 検出した顔の位置を表示
    if (faces.size() > 0) {
        for (let i = 0; i < faces.size(); ++i) {
            const face = faces.get(i);
            cv.rectangle(img, new cv.Point(face.x, face.y), new cv.Point(face.x + face.width, face.y + face.height), new cv.Scalar(0, 0, 255), 2);
        }

        // 画像を表示
        cv.imshow('img', img);
        cv.waitKey(0);
    } else {
        console.log('Nothing detected');
    }

    // メモリリークの防止
    imgGray.delete();
    faces.delete();
    cascade.delete();
}
