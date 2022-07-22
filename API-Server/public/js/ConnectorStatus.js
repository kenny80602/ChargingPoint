function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

let siteId = getCookie("siteId");

// axios
// .get(`http://localhost:3999/api/v2/chargingApp/site/${siteId}/poleStatusStatistics`)
// .then((res) => {

//     let localInfo = res.data.result
//     chargingtable(localInfo)

//     var span = document.body.appendChild(document.createElement("span"));
//     span.innerHTML = JSON.stringify(localInfo);

// })

//建立動態按鈕
function bt1(datas) {
  //建立表格
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  table.appendChild(thead);
  table.appendChild(tbody);

  // Adding the entire table to the body tag
  document.getElementById("body").appendChild(table);

  // 1. 建立表格頭欄位
  var tr = document.createElement("tr");
  thead.appendChild(tr);

  var th1 = document.createElement("th");
  th1.innerHTML = "pole種類";
  tr.appendChild(th1);
  var th2 = document.createElement("th");
  th2.innerHTML = "poleId";
  tr.appendChild(th2);
  var th3 = document.createElement("th");
  th3.innerHTML = "槍的種類";
  tr.appendChild(th3);
  var th4 = document.createElement("th");
  th4.innerHTML = "槍的狀態";
  tr.appendChild(th4);
  var th4 = document.createElement("th");
  th4.innerHTML = "choose";
  tr.appendChild(th4);

  //建立表格內文
  for (var i = 0; i < datas.length; i++) {
    // 外面的for回圈管行 tr

    // 1. 創建 tr行
    var tri = document.createElement("tr");
    tbody.appendChild(tri);
    // 2. 行里面創建單元格(跟資料有關系的3個單元格) td 單元格的數量取決于每個物件里面的屬性個數  for回圈遍歷物件 datas[i]
    for (var k in datas[i]) {
      // 里面的for回圈管列 td

      var td1 = document.createElement("td");
      td1.innerHTML = k;
      tri.appendChild(td1);
      // 創建單元格
      var td = document.createElement("td");
      // 把物件里面的屬性值 datas[i][k] 給 td
      // console.log(datas[i][k]);
      td.innerHTML = datas[i][k];
      tri.appendChild(td);
    }
    //槍狀態
    let connectorstatus = Object.values(datas[i])[1];
    //槍種類編號
      let value = Object.keys(datas[i])[1]
      let connectorNum = value.replace('connectorStatus_','')
    //poleid
    let poleId = Object.values(datas[i])[0];
    //表格內按鈕
    var button = document.createElement("input");
    button.setAttribute("type", "button");
    button.value = "確定";
    //id為 poleId + connector編號
    button.id = poleId + connectorNum;
    var td = document.createElement("td");
    td.appendChild(button);
    tri.appendChild(td);

    let id = button.id;
    console.log(id);
    let addedElt = document.getElementById(id);

    //按鈕觸發事件
    
    
    addedElt.addEventListener("click", function () {
      console.log(id);
      if(connectorstatus === "reserved" ){alert("電樁已被預約，請約別隻樁")}
      if(connectorstatus === "charging" ){alert("電樁正在充電，請約別隻樁")}
      if(connectorstatus === "available" ){
        document.cookie = `poleId = ${poleId} ;`
        document.cookie = `connectorStatusId = ${connectorNum} ;`
      document.location.replace("http://localhost:3999/web/reservation");

      }
    });
  
  }
}

axios
  .get(
    `http://localhost:3999/api/v2/chargingApp/siteId/${siteId}/selectorConnector`
  )
  .then((res) => {
    let localInfo = res.data.result;
    //var span = document.body.appendChild(document.createElement("span"));
    //span.innerHTML = JSON.stringify(localInfo);

    // localInfo.forEach(element => {
    //   //connector編號
    //   let value = Object.keys(element)[1]
    //   let connectorNum = value.replace('connectorStatus_','')
    //   console.log('value' +connectorNum);

    //   //connector狀態
    //   let connectorStatus = Object.values(element)[1]

    //   //id為 poleId + connector編號
    //   let id = element.poleId + connectorNum
    //   console.log(element.poleId);
    //   console.log(connectorNum);
    //   console.log('id' + id);

    //   //按鈕名稱
    //   let bottomName = "poleId_" + element.poleId + " " + value

    //   bt1(element, bottomName, id, connectorStatus)
    // });

    bt1(localInfo);
  });
