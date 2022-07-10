console.log("index.js: loaded");

async function main() {
  try {
    const userId = getUserId();
    console.log(userId);
    const userInfo = await fetchUserInfo(userId);
    console.log(userInfo);
    const view = createView(userInfo);
    displayView(view);
  } catch(error) {
    console.error(`エラーが発生しました (${error})`);
  }
  
  // fetchUserInfo("js-primer-example")
  //   // ここではJSONオブジェクトで解決されるPromise
  //   .then((userInfo) => createView(userInfo))
  //   // ここではHTML文字列で解決されるPromise
  //   .then((view) => displayView(view))
  //   // Promiseチェーンでエラーがあった場合はキャッチされる
  //   .catch((error) => {
  //     // Promiseチェーンの中で発生したエラーを受け取る
  //     console.error(`エラーが発生しました (${error})`);
  //   });
}

/**
 * GitHubからユーザー情報を取得する
 * @param {*} userId 
 * @returns 
 */
function fetchUserInfo(userId) {
  // fetchの返り値のPromiseをreturnする
  return fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
    .then(response => {
      // console.log(response.status);
      // エラーレスポンスが返されたことを検知する。
      if (!response.ok) {
        console.error("エラーレスポンス", response);
        return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
      } else {
        // JSONオブジェクトで解決されるPromiseを返す
        return response.json();
      }
    });
}

function getUserId() {
  return document.getElementById("userId").value;
}

function createView(userInfo) {
  return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
      <dt>Location</dt>
      <dd>${userInfo.location}</dd>
      <dt>Repositories</dt>
      <dd>${userInfo.public_repos}</dd>
    </dl>
  `;
}

function displayView(view) {
  const result = document.getElementById("result");
  result.innerHTML = view;
}

/**
 * エスケープ用関数
 * 
 * @param {*} str 
 * @returns 
 */
function escapeSpecialChars(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * タグ関数 
 * @param {*} strings 
 * @param  {...any} values 
 * @returns 
 */
function escapeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}