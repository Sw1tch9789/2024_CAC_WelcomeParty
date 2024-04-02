window.onload = function () {
    // エレメントの取得
    let transformSelectElts = document.getElementsByClassName('transform-select');
    let currentTransformNameElt = document.getElementById('current-transform-name').getElementsByTagName('span')[0];
    let fileInputElt = document.getElementById('file-input');
    let srcImgElt = document.getElementById('src-img');
    let transformButtonElt = document.getElementById('transform-button');
    let resultImgElt = document.getElementById('result-img');
    let transformLoadingElt = document.getElementById('transform-loading');

    // Utilsクラスのインスタンスを生成
    let utils = new Utils('errorMessage');

    // 画像が選択されているか
    let isImageSelected = false;

    // ファイル入力のイベントリスナーを設定
    utils.addFileInputHandler('file-input', 'src-img');
    fileInputElt.addEventListener('change', function () {
        isImageSelected = true;
    });

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

    // 現在の変換処理
    let currentTransform = transformMap['transform-grayscale'][1];

    // 変換処理選択ボタンのイベントリスナーを設定
    for (let elt of transformSelectElts) {
        elt.addEventListener('click', function () {
            currentTransformNameElt.textContent = transformMap[elt.id][0];
            currentTransform = transformMap[elt.id][1];
        });
    }

    // 変換ボタンが押されたときの処理
    transformButtonElt.addEventListener('click', function () {
        // 画像が読み込まれていない場合は何もしない
        if (!isImageSelected) return;
        // ボタンを無効化
        transformButtonElt.setAttribute('disabled', '');
        // ローディングアニメーションを表示
        transformLoadingElt.style.visibility = 'visible';
        // 変換処理
        console.log('currentTransform: ', currentTransform.name);
        currentTransform(srcImgElt, resultImgElt);
        // ローディングアニメーションを非表示
        transformLoadingElt.style.visibility = 'hidden';
        // ボタンを有効化
        transformButtonElt.removeAttribute('disabled');
    });
};
