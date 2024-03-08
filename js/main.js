// エレメントの取得
let fileInputElt = document.getElementById('file-input');
let srcImgElt = document.getElementById('src-img');
let transformButtonElt = document.getElementById('transform-button');
let resultImgElt = document.getElementById('result-img');

// ファイルが選択されたときの処理
fileInputElt.addEventListener('input', function() {
    if (fileInputElt.files[0] == undefined) return;
    srcImgElt.src = URL.createObjectURL(fileInputElt.files[0]);
});

// 変換ボタンが押されたときの処理
transformButtonElt.addEventListener('click', function() {
    if (srcImgElt.src == '') return;
    let srcImgMat = cv.imread(srcImgElt);
    let resultImgMat = transform(srcImgMat);
    cv.imshow(resultImgElt, resultImgMat);
    srcImgMat.delete();
    resultImgMat.delete();
});

