// fetch(
//   "http://localhost:3999/api/v2/chargingApp/siteId/123/pole/1/connector/1",
//   {
//     method: "GET",
//   }
// )
//   .then((response) => {
//     return response.json();
//   })
//   .then(function (myJson) {
//     console.log(myJson);
//     const div = document.getElementById("content");
//     setTimeout(() => {
//       div.innerHTML = `${JSON.stringify(myJson)}`;
//     }, 5000);
//   })
//   .catch((error) => {
//     console.log(`Error: ${error}`);
//   });

//json轉表格

// 1.先準備好學生的資料,用陣列形式儲存，每個陣列元素是一個物件

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
  th1.innerHTML = "siteId";
  tr.appendChild(th1);
  var th2 = document.createElement("th");
  th2.innerHTML = "status";
  tr.appendChild(th2);
  var th3 = document.createElement("th");
  th3.innerHTML = "choose";
  tr.appendChild(th3);

  //建立表格內文
  for (var i = 0; i < datas.length; i++) { // 外面的for回圈管行 tr
    delete datas[i].location
    // 1. 創建 tr行
    var tri = document.createElement('tr');
    tbody.appendChild(tri);
    // 2. 行里面創建單元格(跟資料有關系的3個單元格) td 單元格的數量取決于每個物件里面的屬性個數  for回圈遍歷物件 datas[i]
    for (var k in datas[i]) { // 里面的for回圈管列 td
        // 創建單元格 
        var td = document.createElement('td');
        // 把物件里面的屬性值 datas[i][k] 給 td  
        // console.log(datas[i][k]);
        td.innerHTML = datas[i][k];
        tri.appendChild(td);

    }


  //表格內按鈕
  var button = document.createElement("input");
  button.setAttribute("type", "button");
  button.value = "確定";
  button.id = datas[i].siteId;
  var td = document.createElement('td');
  td.appendChild(button);
  tri.appendChild(td);
  
  let id = button.id
  
  let addedElt = document.getElementById(id)

  //按鈕觸發事件
  addedElt.addEventListener("click", function(){
    console.log(id);

    document.cookie = `siteId = ${id} ;`
    document.location.replace('http://localhost:3999/web/poleState')
  });



}





}

document.getElementById("localButton").addEventListener("click", function (e) {
  e.preventDefault();
  let lat = document.getElementById("lat").value;
  let lng = document.getElementById("lng").value;
  let radius = document.getElementById("radius").value;

  axios
    .get(
      `http://localhost:3999/api/v2/chargingApp/nearStation?lat=${lat}&lng=${lng}&radius=${radius}`
    )
    .then((res) => {
      console.log(res.data.result);

      let localInfo = res.data.result;

      // localInfo.forEach(element => {
      //   let value = element.siteId
      //   console.log('value' +value);
      //   let id = element.siteId
      //   console.log('id' +id);
      //   bt1(localInfo,value,id)
      // });

      bt1(localInfo);
    });
});
