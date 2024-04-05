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
    let image = cv.imread(srcImgElt); // 画像を読み込む
    image = adjustImageSize(image); // 画像のリサイズ
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0); // グレースケールに変換
    cv.imshow(resultImgElt, image); // 画像を表示
    image.delete(); // メモリの解放
}

// 顔を検出
function transformFace(srcImgElt, resultImgElt) {
    // 画像を読み込む
    let image = cv.imread(srcImgElt);
    // 画像のリサイズ
    image = adjustImageSize(image);
    // グレースケールに変換
    let gray = new cv.Mat();
    cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY, 0);
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
        let roiSrc = image.roi(faces.get(i));
        let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
        let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
            faces.get(i).y + faces.get(i).height);
        cv.rectangle(image, point1, point2, [255, 0, 0, 255]);
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
    cv.imshow(resultImgElt, image);
    image.delete(); gray.delete(); faceCascade.delete();
    eyeCascade.delete(); faces.delete(); eyes.delete();
}

// 画像のサイズを512x512以下に調整
function adjustImageSize(image) {
    const MAX_LENGTH = 512;
    const size = image.size();
    const longer = Math.max(size.height, size.width);
    const scale = MAX_LENGTH / longer;
    const newSize = new cv.Size(size.width * scale, size.height * scale);
    cv.resize(image, image, newSize);
    return image;
}

// 任意の画風変換
async function transformArbitraryImageStylization(srcImgElt, resultImgElt, styleImagePath) {
    // コンテンツ画像をテンソルに変換
    const contentImage = readAndAdjustForModel(srcImgElt);

    // スタイル画像を読み込む
    let styleImageElt = await loadImage(styleImagePath);

    // スタイル画像をテンソルに変換
    const styleImage = readAndAdjustForModel(styleImageElt);
    styleImageElt = null; // メモリの解放

    // モデルのロード
    const modelUrl = 'model/arbitrary-image-stylization/model.json';
    model = await tf.loadGraphModel(modelUrl);

    // スタイル変換
    let stylizedImage = model.execute([contentImage, styleImage]);

    // 画像を表示
    await adjustForCanvasAndShow(stylizedImage, resultImgElt);

    // メモリの解放
    contentImage.dispose(); styleImage.dispose(); model.dispose();
}

// アニメの森みたいな画風
async function transformStyleAnimeForest(srcImgElt, resultImgElt) {
    await transformArbitraryImageStylization(srcImgElt, resultImgElt, 'image/style-image/animeForest.png');
}

// 富士山みたいな画風
async function transformStyleFuji(srcImgElt, resultImgElt) {
    await transformArbitraryImageStylization(srcImgElt, resultImgElt, 'image/style-image/fuji.jpg');
}

// 月面みたいな画風
async function transformStyleMoon(srcImgElt, resultImgElt) {
    await transformArbitraryImageStylization(srcImgElt, resultImgElt, 'image/style-image/moon.jpg');
}

// 新聞紙みたいな画風
async function transformStyleNewspaper(srcImgElt, resultImgElt) {
    await transformArbitraryImageStylization(srcImgElt, resultImgElt, 'image/style-image/newspaper.jpg');
}

// 水玉模様みたいな画風
async function transformStylePolkaDot(srcImgElt, resultImgElt) {
    await transformArbitraryImageStylization(srcImgElt, resultImgElt, 'image/style-image/polkaDot.png');
}

// 夕焼けの空みたいな画風
async function transformStyleSunsetSky(srcImgElt, resultImgElt) {
    await transformArbitraryImageStylization(srcImgElt, resultImgElt, 'image/style-image/sunsetSky.jpg');
}

// 画像を読み込んでモデルに合わせて変換
function readAndAdjustForModel(pixels) {
    const MAX_LENGTH = 512; // 画像の最大辺の長さ
    return tf.tidy(() => {
        // 画像を読み込む
        let image = tf.browser.fromPixels(pixels);

        // リサイズ
        const shape = image.shape.slice(0, 2);
        const longerDim = Math.max(shape[0], shape[1]);
        const scale = MAX_LENGTH / longerDim;
        const newShape = shape.map(dim => Math.round(dim * scale));
        image = tf.image.resizeBilinear(image, newShape);

        // モデルに合わせて変換
        image = image.expandDims();
        image = tf.cast(image, 'float32');
        image = tf.div(image, 255);

        return image;
    });
}

// 画像をキャンバスに合わせて変換して表示
async function adjustForCanvasAndShow(image, resultImgElt) {
    // キャンバスに合わせて変換
    image = tf.tidy(() => {
        image = tf.mul(image, 255);
        image = tf.squeeze(image, 0);
        image = tf.cast(image, 'int32');
        return image;
    });

    // 画像を表示
    await tf.browser.toPixels(image, resultImgElt);

    // メモリの解放
    image.dispose();
}

// パスから画像を読み込む
async function loadImage(path) {
    const imageElt = new Image();
    imageElt.src = path;
    return new Promise((resolve) => {
        imageElt.onload = () => {
            resolve(imageElt);
        }
    });
}
