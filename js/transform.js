// 変換idと、変換名・変換処理のマッピング
const transformMap = {
    'transform-grayscale': ['グレースケール', transformGrayScale],
    'transform-face': ['顔検出', transformFace],
    'transform-style-anime-forest': ['アニメの森みたいな画風', transformStyleAnimeForest],
    'transform-style-fuji': ['富士山みたいな画風', transformStyleFuji],
    'transform-style-moon': ['月面みたいな画風', transformStyleMoon],
    'transform-style-newspaper': ['新聞紙みたいな画風', transformStyleNewspaper],
    'transform-style-polka-dot': ['水玉模様みたいな画風', transformStylePolkaDot],
    'transform-style-sunset-sky': ['夕焼けの空みたいな画風', transformStyleSunsetSky],


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

function transformArbitraryImageStylization(srcImgElt, resultImgElt, styleImagePath) {
    // コンテンツ画像をテンソルに変換
    const contentImage = readImageAndAdjustForModel(srcImgElt);

    // スタイル画像のためのエレメントを生成
    let styleImageElt = new Image();
    styleImageElt.src = styleImagePath;
    styleImageElt.onload = () => {
        // スタイル画像をテンソルに変換
        const styleImage = readImageAndAdjustForModel(styleImageElt);
        styleImageElt = null; // メモリの解放

        // モデルのロード
        const modelUrl = 'model/arbitrary-image-stylization/model.json';
        tf.loadGraphModel(modelUrl).then(model => {
            // スタイル変換
            let stylizedImage = model.execute([contentImage, styleImage]);

            // 画像を表示
            adjustForCanvasAndShow(stylizedImage, resultImgElt);

            // メモリの解放
            contentImage.dispose(); styleImage.dispose(); model.dispose();
        });
    };
}

function transformStyleAnimeForest(srcImgElt, resultImgElt) {
    transformArbitraryImageStylization(srcImgElt, resultImgElt, 'image/style-image/animeForest.png');
}

function transformStyleFuji(srcImgElt, resultImgElt) {
    transformArbitraryImageStylization(srcImgElt, resultImgElt, 'image/style-image/fuji.jpg');
}

function transformStyleMoon(srcImgElt, resultImgElt) {
    transformArbitraryImageStylization(srcImgElt, resultImgElt, 'image/style-image/moon.jpg');
}

function transformStyleNewspaper(srcImgElt, resultImgElt) {
    transformArbitraryImageStylization(srcImgElt, resultImgElt, 'image/style-image/newspaper.jpg');
}

function transformStylePolkaDot(srcImgElt, resultImgElt) {
    transformArbitraryImageStylization(srcImgElt, resultImgElt, 'image/style-image/polkaDot.png');
}

function transformStyleSunsetSky(srcImgElt, resultImgElt) {
    transformArbitraryImageStylization(srcImgElt, resultImgElt, 'image/style-image/sunsetSky.jpg');
}







function readImageAndAdjustForModel(pixels) {
    const max_dim = 512; // 画像の最大辺の長さ
    return tf.tidy(() => {
        // 画像を読み込む
        let image = tf.browser.fromPixels(pixels);

        // リサイズ
        const shape = image.shape.slice(0, 2);
        const longestDim = Math.max(shape[0], shape[1]);
        const scale = max_dim / longestDim;
        const newShape = shape.map(dim => Math.round(dim * scale));
        image = tf.image.resizeBilinear(image, newShape);

        // モデルに合わせて変換
        image = image.expandDims();
        image = tf.cast(image, 'float32');
        image = tf.div(image, 255);

        return image;
    });
}

function adjustForCanvasAndShow(image, resultImgElt) {
    tf.tidy(() => {
        // キャンバスに合わせて変換
        image = tf.mul(image, 255);
        image = tf.squeeze(image, 0);
        image = tf.cast(image, 'int32');

        // 画像を表示
        tf.browser.toPixels(image, resultImgElt);
    });
}

