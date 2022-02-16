
google.charts.load('current', {
'packages':['geochart'],
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap(type) {
    if(type==undefined){
        type = 'cases'
    }
    var charData = google.visualization.arrayToDataTable(main(type));

    var options = {colorAxis: {colors: ['#05AF00','#970000']},
    backgroundColor: '#81d4fa',
    datalessRegionColor: '#f8bbd0',
    defaultColor: '#f5f5f5'};

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    chart.draw(charData, options);
}

function changeMap(type){
    if(type == 1){
        type = "vaccines"
    }
    else if(type == 2){
        type =  "history"
    }
    else{
        type = 'cases'
    }
    drawRegionsMap(type);
}


function makeCovidCountryCasesList(apiJson)
{
    let data=[];
    let header = ["Country", "Confirmed","Deaths"];
    data.push(header);
    for(let i in apiJson){
        let temp=[];
        temp[0]=apiJson[i].All.country
        temp[1]=apiJson[i].All.confirmed
        temp[2]=apiJson[i].All.deaths
        data.push(temp);
    }
    data.pop(); //Delete global from our data
    return data;
}

function makeCovidCountryVaccinesList(apiJson)
{
    let data=[];
    let header = ["Country", "Vaccinated people","People partially vaccinated"];
    data.push(header);
    for(let i in apiJson){
        let temp=[];
        if(i != "World"){
            temp[0]=apiJson[i].All.country
            temp[1]=apiJson[i].All.people_vaccinated
            temp[2]=apiJson[i].All.people_partially_vaccinated
            data.push(temp);
        } 
    }
    data.pop(); //Delete global from our data
    return data;
}

function makeCovidCountryHistoryList(apiJson){
    let data=[];
    let header = ["Country", "Population","Dados"];
    data.push(header);
    for(let i in apiJson){
        let temp=[];
        if(i != "World"){
            temp[0]=apiJson[i].All.country
            temp[1]=apiJson[i].All.population
            temp[2]=apiJson[i].All.dates
            data.push(temp);
        } 
    }
    data.pop(); //Delete global from our data
    return data;
}


function apiRequest(url){
    let request = new XMLHttpRequest();
    request.open("GET",url,false);
    request.send();
    return request.responseText;
}

function getsRequest(url,type){
    url +=type;
    return apiRequest(url);
}

function main(type){
    let url = "https://covid-api.mmediagroup.fr/v1/";
    let apiData = (getsRequest(url,type));
    let apiJson = JSON.parse(apiData);
    
    switch(type){
        case 'cases':
            return makeCovidCountryCasesList(apiJson);
            break;
        case'vaccines':
            return makeCovidCountryVaccinesList(apiJson);
            break;
        case'history':makeCovidCountryHistoryList(apiJson);
            break;
    }
    
}

