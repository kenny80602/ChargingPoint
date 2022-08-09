function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
    const connectorStatusId = getCookie('connectorStatusId')
    let id = getCookie('transactionId')
    const poleId = getCookie('poleId')
    const siteId = getCookie('siteId')

    console.log(id);

    //建立表格

    function chargingtable(datas) {
        


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
    th1.innerHTML = "最終量測類別";
    tr.appendChild(th1);

    var th2 = document.createElement("th");
    th2.innerHTML = "最終量測值結果";
    tr.appendChild(th2);


  //建立表格內文
  // 1. 創建 tr行

  // 2. 行里面創建單元格(跟資料有關系的3個單元格) td 單元格的數量取決于每個物件里面的屬性個數  for回圈遍歷物件 datas[i]
  for (var k in datas) {
  
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
      
    
      



   // 取得meterValues值
  
     axios
        .get(  `/api/v2/transactionInfo/transaction/${id}`)
        .then((res) => { 
            
            let localInfo = res.data.result
            console.log(res);
            console.log(JSON.stringify(localInfo));
            chargingtable(localInfo[0])
            
        })

        alert("完成充電")


    //開始充電
    document.getElementById("firstPage").addEventListener('click', function(e) {
        document.location.replace("/web")
    })