function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


    const connectorStatusId = getCookie('connectorStatusId')
    const poleId = getCookie('poleId')
    const siteId = getCookie('siteId')
    

    console.log(connectorStatusId);
    console.log(poleId);
    console.log(siteId);

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
        th1.innerHTML = "預約狀態";
        tr.appendChild(th1);
        var th2 = document.createElement("th");
        th2.innerHTML = "transactionId";
        tr.appendChild(th2);
        // var th3 = document.createElement("th");
        // th3.innerHTML = "choose";
        // tr.appendChild(th3);
      
        //建立表格內文

          // 1. 創建 tr行
          var tri = document.createElement('tr');
          tbody.appendChild(tri);
          // 2. 行里面創建單元格(跟資料有關系的3個單元格) td 單元格的數量取決于每個物件里面的屬性個數  for回圈遍歷物件 datas[i]
          for (var k in datas) { // 里面的for回圈管列 td
              // 創建單元格 
              var td = document.createElement('td');
              // 把物件里面的屬性值 datas[i][k] 給 td  
              // console.log(datas[i][k]);
              td.innerHTML = datas[k];
              tri.appendChild(td);
      
          }
     
      
      
    }
    
    
    //預約充電樁結果
    axios
    .post(`http://3.112.46.100:3999/api/v2/reservation`,{
        "siteId": siteId,
        "poleId" : poleId,
        "connectorId": connectorStatusId,
        "idTag" : "kenny"
    })
    .then((res) => {    
        let reservationStatus = res.data.result
        console.log(reservationStatus);
        chargingtable(reservationStatus)
        let transactionId = res.data.result.transactionId
        document.cookie = `transactionId = ${transactionId} ;`   
    })


    //預約充電樁時間
    const duration =  document.getElementById("reservationTime").addEventListener('click',function(e){
        e.preventDefault();
        const duration = document.getElementById("duration").value
        return duration
    })


    //建立動態按鈕

    function bt1(value, id) {
    document.body.appendChild(document.createElement("br"))
    document.body.appendChild(document.createElement("br"))
    //create a button
    var button = document.body.appendChild(document.createElement("input"));
    button.setAttribute("type", "button");
    button.value = value;
    button.id = id
    var addedElt = document.getElementById(id);

    addedElt.addEventListener("click", function(){
      document.location.replace('http://3.112.46.100:3999/web/meterValue')
    });
   
    }

//開始充電
    document.getElementById("startCharging").addEventListener('click', function(e) {
        const duration =  document.getElementById("duration").value
        console.log(duration && duration );
        if(duration && duration != 0){
            const duration =  document.getElementById("duration").value
            console.log(duration);
             axios
             .post(`/api/v2//site/remoteStartTransaction`,{
                 "poleId": poleId,
                 "connectorId" : connectorStatusId,
                 "idTag": "kenny",
                 "duration" : duration,
                 "transactionId" : "transactionId"
             })
     
             alert("開始充電")
             
              bt1("chargingStatus", "chargingStatus")
        }else{
            alert("請輸入預約充電時間")
        }
      

    })





 