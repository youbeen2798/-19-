const getXMLfromAPI = async (reqURL) => {

  const response = await fetch(reqURL);
  const responseToText = await response.text();
  const responseDom = new DOMParser().parseFromString(responseToText, "application/xml");
  return responseDom;
};


function domToObjectList(doc){
  const items = doc.querySelectorAll('item'); //item 배열

  console.log(items.length); //3177

  const itemObjects = [...items].map(item => {
    return ({
      nationNm: item.querySelector('nationNm').textContent, //국가
      natDefCnt: item.querySelector('natDefCnt').textContent, //누적확진자
      natDeathRate: item.querySelector('natDeathRate').textContent, //사망률
      natDeathCnt: item.querySelector('natDeathCnt').textContent, //누적사망자수
      stdDay: item.querySelector('stdDay').textContent, //기준일자
    })
  })

  return itemObjects; //객체 배열
}

async function minusclick(){

  const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson';
  const authKey = 'sddo3Rg2SQGPF8uXBFebAdbqK3YZDXPMcVcfieLdWs6fK4gtMZIb9fL%2FEgXyOJSMPcGP7%2BwsKAH9qO6n5vQPvA%3D%3D';
//  const authKey = 'R6W5Dm9WxSDjBSSsJloPdjoev%2FuGEbaC4oQmZqV4Tii4KB8w4m9QxeO%2BfyWcUWws9ntmPIzWVKlW93dNkLNsxQ%3D%3D';
  let reqURL = url + "?serviceKey=" + authKey + '&pageNo=1&numOfRows=10&startCreateDt=20220901&endCreateDt=20220901';


  const doc = await getXMLfromAPI(reqURL);
  const objectList = domToObjectList(doc);

  clearTable();
  generateTable(objectList
    .map(object => {
      const {nationNm, natDefCnt, natDeathRate} = object;
      return ({nationNm, natDefCnt, natDeathRate})
    }).slice(0, 60));
}

async function plusclick(){

  const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson';
  const authKey = 'sddo3Rg2SQGPF8uXBFebAdbqK3YZDXPMcVcfieLdWs6fK4gtMZIb9fL%2FEgXyOJSMPcGP7%2BwsKAH9qO6n5vQPvA%3D%3D';
//  const authKey = 'R6W5Dm9WxSDjBSSsJloPdjoev%2FuGEbaC4oQmZqV4Tii4KB8w4m9QxeO%2BfyWcUWws9ntmPIzWVKlW93dNkLNsxQ%3D%3D';
  let reqURL = url + "?serviceKey=" + authKey + '&pageNo=1&numOfRows=10&startCreateDt=20220901&endCreateDt=20220901';


  const doc = await getXMLfromAPI(reqURL);
  const objectList = domToObjectList(doc);

  clearTable();

  generateTable(objectList
    .map(object => {
      const {nationNm, natDefCnt, natDeathRate} = object;
      return ({nationNm, natDefCnt, natDeathRate})
    }).slice(120, 190));

}


function generateNationTable(objectList, nationName){
  let bodyText = '';
  console.log(nationName);

  objectList
  .filter(object => object.nationNm === nationName)
  .map(object => {
    const {nationNm, natDefCnt, natDeathRate, natDeathCnt, stdDay} = object;
    return ({nationNm, natDefCnt, natDeathRate, natDeathCnt, stdDay})
  })
  .forEach((item) => {
    const row = document.createElement('tr');
    Object.keys(item).forEach((key) => {
    const cell = document.createElement('td');
      cell.textContent = item[key]
      row.appendChild(cell);
    });
    bodyText += new XMLSerializer().serializeToString(row);
  });

  const newPage = window.open("index2.html", "newWindow")
 window.addEventListener('message', (e) => {
   if (e.data === 'load') {
     newPage.postMessage(bodyText, '*');
   }
 })
}



function generateTable(objectList){
  const tbl = document.getElementsByTagName("table");
  const tblBody = document.createElement("tbody");

  objectList.forEach((item) => {
    const row = document.createElement('tr');
    row.classList.add("rowrow");

    Object.keys(item).forEach((key) => {
      const cell = document.createElement('td');
      if (key === 'nationNm') {
        cell.addEventListener('click', () => {
          onNationNameClick(item[key])
        });
      }
      cell.textContent = item[key]
      row.appendChild(cell);
    });
    tblBody.appendChild(row);
  });

  tbl[0].appendChild(tblBody); //전체 테이블
}


async function objectListToArr(){

  const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson';
  const authKey = 'sddo3Rg2SQGPF8uXBFebAdbqK3YZDXPMcVcfieLdWs6fK4gtMZIb9fL%2FEgXyOJSMPcGP7%2BwsKAH9qO6n5vQPvA%3D%3D';
//  const authKey = 'R6W5Dm9WxSDjBSSsJloPdjoev%2FuGEbaC4oQmZqV4Tii4KB8w4m9QxeO%2BfyWcUWws9ntmPIzWVKlW93dNkLNsxQ%3D%3D';
  let reqURL = url + "?serviceKey=" + authKey + '&pageNo=1&numOfRows=10&startCreateDt=20220901&endCreateDt=20220901';

  const doc = await getXMLfromAPI(reqURL);
  const objectList = domToObjectList(doc);

  const arr = [];

  for(let i = 0; i< objectList.length; i++){
    const object = [objectList[i].nationNm, objectList[i].natDefCnt];
    console.log(Array.isArray(object)); //true
    arr.push(object);
    console.log(object);
  }

  console.log(arr[0][0] + arr[0][1]);
  console.log(arr[1][0] + arr[1][1]);
  console.log(arr[2][0] + arr[2][1]);

  console.log(typeof arr); //object

  return arr;

}

async function drawRegionsMap(){

  google.charts.load('current', {
        'packages':['geochart'],
  });

  google.charts.setOnLoadCallback(drawRegionsMap); //여기서 drawRegionsMap이라는 함수를 부름
}

async function drawRegionsMap(){
    const arrs = await objectListToArr(); //2차원 배열

    console.log(arrs.length); //190
    console.log(Array.isArray(arrs)); //


    const data = google.visualization.arrayToDataTable(arrs);
    const options = {};
    const chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
    chart.draw(data, options);
}


async function onNationNameClick(nationName){

  const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson';
  const authKey = 'sddo3Rg2SQGPF8uXBFebAdbqK3YZDXPMcVcfieLdWs6fK4gtMZIb9fL%2FEgXyOJSMPcGP7%2BwsKAH9qO6n5vQPvA%3D%3D';
//  const authKey = 'R6W5Dm9WxSDjBSSsJloPdjoev%2FuGEbaC4oQmZqV4Tii4KB8w4m9QxeO%2BfyWcUWws9ntmPIzWVKlW93dNkLNsxQ%3D%3D';
  let reqURL = url + "?serviceKey=" + authKey + '&pageNo=1&numOfRows=10&startCreateDt=20220901&endCreateDt=20220930';

//  let reqURL = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson?serviceKey=R6W5Dm9WxSDjBSSsJloPdjoev%2FuGEbaC4oQmZqV4Tii4KB8w4m9QxeO%2BfyWcUWws9ntmPIzWVKlW93dNkLNsxQ%3D%3D&pageNo=1&numOfRows=10&startCreateDt=20200310&endCreateDt=20200414';
  const doc = await getXMLfromAPI(reqURL);
  const objectList = domToObjectList(doc);

  console.log(nationName);

  generateNationTable(objectList, nationName);
}



function clearTable(){
    const row = document.querySelectorAll('.rowrow');

    [...row].forEach((item) => {
      item.remove();
    });
}



(async function init(){

  const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson';
  const authKey = 'sddo3Rg2SQGPF8uXBFebAdbqK3YZDXPMcVcfieLdWs6fK4gtMZIb9fL%2FEgXyOJSMPcGP7%2BwsKAH9qO6n5vQPvA%3D%3D';

  const reqURL = url + "?serviceKey=" + authKey + '&pageNo=1&numOfRows=10&startCreateDt=20220901&endCreateDt=20220901';

  const doc = await getXMLfromAPI(reqURL);

  console.log("doc: " + typeof doc);
  console.log(typeof doc.querySelectorAll('item')) //190
  console.log(doc.querySelectorAll('item').length) //190

  const objectList = domToObjectList(doc);

  console.log("objectList: " + objectList.length); //190

  generateTable(objectList
    .map(object => {
      const {nationNm, natDefCnt, natDeathRate} = object;
      return ({nationNm, natDefCnt, natDeathRate})
    }).slice(60,120));

    drawRegionsMap();
})();
