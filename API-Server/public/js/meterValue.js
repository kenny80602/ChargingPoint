function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const transactionId = getCookie("transactionId");
const connectorStatusId = getCookie("connectorStatusId");
const poleId = getCookie("poleId");

console.log(transactionId);
console.log(connectorStatusId);
console.log(poleId);

//建立動態按鈕
function chargingtable(datas, triggerNum) {
  console.log(triggerNum);



  if (triggerNum === 0) {
    //建立表格
  let table = document.createElement("table");
  table.id = "tab";
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  table.appendChild(thead);
  table.appendChild(tbody);

  // Adding the entire table to the body tag
  document.getElementById("body").appendChild(table);
  document.getElementById("body");
    // 1. 建立表格頭欄位
    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var th1 = document.createElement("th");
    th1.id = "measure";
    th1.innerHTML = "量測類別";
    tr.appendChild(th1);

    var th2 = document.createElement("th");
    th2.id = "measureValue";
    th2.innerHTML = "量測值";
    tr.appendChild(th2);


  //建立表格內文
  // 1. 創建 tr行

  // 2. 行里面創建單元格(跟資料有關系的3個單元格) td 單元格的數量取決于每個物件里面的屬性個數  for回圈遍歷物件 datas[i]
  for (var k in datas) {
    if (triggerNum === 0) {
      var tri = document.createElement("tr");
      tbody.appendChild(tri);

      var td1 = document.createElement("td");
      td1.innerHTML = k;
      tri.appendChild(td1);

      // 創建單元格
      var td = document.createElement("td");
      td.innerHTML = datas[k];
      tri.appendChild(td);
    }
  }
}

if (triggerNum > 0) {
    let rowsNum = 1;
    for (var k in datas) {
        document.getElementById("tab").rows[rowsNum].childNodes[1].innerText =datas[k];
        rowsNum = rowsNum + 1;
      }
    }

}

// 取得meterValues值
let triggerNum = 0;

setInterval(() => {
  axios
    .get(`http://3.112.46.100:3999/api/v2/meterValues/${transactionId}`)
    .then((res) => {
      let localInfo = res.data.result;
      console.log(JSON.stringify(localInfo));

      chargingtable(localInfo, triggerNum);

      triggerNum = triggerNum + 1;
    });
}, 2000);

//結束充電
document.getElementById("stopCharging").addEventListener("click", function (e) {
  e.preventDefault();

  axios.post(`http://3.112.46.100:3999/api/v2/site/remoteStopTransaction`, {
    connectorId: connectorStatusId,
    poleId: poleId,
    transactionId: transactionId,
  });

  alert("結束充電充電");

  document.location.replace("http://3.112.46.100:3999/web/finishCharging");
});
