// 変換名と変換処理のマッピング
let transformMap = {
    'transform-gray-scale': ['グレイスケール', transformGrayScale],
    'transform-face': ['顔認識', transformFace],
};

window.onload = function () {
    // エレメントの取得
    let currentTransformNameElt = document.getElementById('current-transform-name').getElementsByTagName('span')[0];
    let srcImgElt = document.getElementById('src-img');
    let transformButtonElt = document.getElementById('transform-button');
    let resultImgElt = document.getElementById('result-img');
    let transformLoadingElt = document.getElementById('transform-loading');

    // Utilsクラスのインスタンスを生成
    let utils = new Utils('errorMessage');

    // ファイル入力のイベントリスナーを設定
    utils.addFileInputHandler('file-input', 'src-img');

    // OpenCVのロード
    utils.loadOpenCv(() => {
        let eyeCascadeFilePath = 'haarcascade_eye.xml';
        let eyeCascadeFileUrl = 'model/haarcascade_eye.xml';
        utils.createFileFromUrl(eyeCascadeFilePath, eyeCascadeFileUrl, () => {
            let faceCascadeFilePath = 'haarcascade_frontalface_default.xml';
            let faceCascadeFileUrl = 'model/haarcascade_frontalface_default.xml';
            utils.createFileFromUrl(faceCascadeFilePath, faceCascadeFileUrl, () => {
                transformButtonElt.removeAttribute('disabled');
            });
        });
    });

    // 現在の変換処理名
    let currentTransform = transformGrayScale;

    // 変換処理選択ボタンのイベントリスナーを設定
    let transformSelectElts = document.getElementsByClassName('transform-select');
    for (let elt of transformSelectElts) {
        elt.addEventListener('click', function () {
            currentTransformNameElt.textContent = transformMap[elt.id][0];
            currentTransform = transformMap[elt.id][1];
        });
    }

    // 変換ボタンが押されたときの処理
    transformButtonElt.addEventListener('click', function () {
        // 画像が読み込まれていない場合は何もしない
        if (srcImgElt.src == '') return;
        // ボタンを無効化
        transformButtonElt.disabled = true;
        // ローディングアニメーションを表示
        transformLoadingElt.style.visibility = 'visible';
        // 変換処理
        currentTransform(srcImgElt, resultImgElt);
        // ローディングアニメーションを非表示
        transformLoadingElt.style.visibility = 'hidden';
        // ボタンを有効化
        transformButtonElt.disabled = false;
    });
};

