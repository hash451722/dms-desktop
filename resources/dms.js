// Document management system desktop version


// ==== jsonファイルの選択と読み取り ====
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', handleFileSelect);
function handleFileSelect(event) {
  const file = event.target.files[0]; // 選択されたファイルを取得
  if (file) {
    const reader = new FileReader(); // FileReader オブジェクトを作成
    reader.onload = function(e) {
      try {
        const jsonData = JSON.parse(e.target.result); // JSON 文字列をオブジェクトに変換
        // JSONデータが正常に読み取られた場合の処理
        insert_document_list(jsonData)
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
    reader.onerror = function(error) {
      console.error('Error reading file:', error);
    };
    reader.readAsText(file); // ファイルをテキストとして読み込む
  }
}



// jsonに記載の全てのdocument要素を挿入
function insert_document_list(jsonData) {
    const element_parent = document.getElementById("document-list");
    let tags = [];
    for (const d of jsonData) {
        // documentカード要素の作成
        const newHTML = `
            <article id=${d["id"]}>
              <a href="database/documents/${d["filename"]}" target="_blank">
                <div class="article-thumbnail">
                </div>
                <div class="article-text">
                </div>
                <p> ${d["title"]} </p>  
              </a>
            </article>
        `;
        // 要素内部の末尾に挿入
        element_parent.insertAdjacentHTML('beforeend', newHTML);

        // 全てのtagを取得
        tags.push(...d["tags"]); // array2の要素をarray1に追加
    }

    // 全てのtagボタンを設置（重複なし）
    const tags_element = document.getElementById("tags-container");
    tags = [...new Set(tags)];  // 重複を削除
    for (const tag of tags) {
        const newHTML = `
            <button id="${tag}" class="tag-button" type="button"> ${tag} </button>
        `;
        tags_element.insertAdjacentHTML('beforeend', newHTML);
    }

    // tagボタンを押したときの処理
    const tag_buttons = document.querySelectorAll('.tag-button');
    tag_buttons.forEach(button => {
      button.addEventListener('click', () => {
        // console.log(button.id + 'が押されました');
        // ボタンが押された時の共通処理
        toggleVisibilityDocument(jsonData, button.id)
      });
    });
}


// 押されたtagボタンでdocument要素の表示・非表示の切り替え
function toggleVisibilityDocument(jsonData, pushedTag) {
    // console.log(pushedTag + 'が押されました');
    let all_tags = false;
    if ("all-tags" === pushedTag) {
      all_tags = true;
    }
    for (const d of jsonData) {
        const element = document.getElementById(d["id"].toString());
        if (d["tags"].includes(pushedTag) || all_tags) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    }
}
