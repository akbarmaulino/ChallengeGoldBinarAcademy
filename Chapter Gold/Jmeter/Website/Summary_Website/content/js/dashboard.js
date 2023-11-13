/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.46839285714285717, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.645, 500, 1500, "Delete Product"], "isController": false}, {"data": [0.475, 500, 1500, "Get Product ID"], "isController": false}, {"data": [0.06, 500, 1500, "Update Profile"], "isController": false}, {"data": [0.37, 500, 1500, "Get Profile"], "isController": false}, {"data": [0.4375, 500, 1500, "Login"], "isController": false}, {"data": [0.72, 500, 1500, "Get Offers"], "isController": false}, {"data": [0.405, 500, 1500, "Update Product"], "isController": false}, {"data": [0.5675, 500, 1500, "Post Offers"], "isController": false}, {"data": [0.645, 500, 1500, "List Category"], "isController": false}, {"data": [0.6825, 500, 1500, "Update Offers"], "isController": false}, {"data": [0.265, 500, 1500, "Registration"], "isController": false}, {"data": [0.7, 500, 1500, "Get Category"], "isController": false}, {"data": [0.3375, 500, 1500, "List Product"], "isController": false}, {"data": [0.2475, 500, 1500, "Create Product"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2800, 0, 0.0, 1103.9492857142864, 25, 4000, 1040.0, 1972.7000000000003, 2234.95, 2834.9799999999996, 17.904072537071023, 43.51497657683724, 21.116608415153877], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Product", 200, 0, 0.0, 761.3749999999998, 46, 2272, 672.5, 1251.2, 1709.55, 2266.290000000001, 1.4225762856533182, 1.38684517035351, 0.9290506748346254], "isController": false}, {"data": ["Get Product ID", 200, 0, 0.0, 1053.9800000000005, 252, 2234, 1047.0, 1517.8000000000002, 1725.7999999999997, 2107.4700000000003, 1.3749389870824482, 2.855583122366132, 0.8681719240896184], "isController": false}, {"data": ["Update Profile", 200, 0, 0.0, 2098.8749999999986, 1010, 4000, 2008.0, 2892.4000000000005, 3171.7499999999995, 3993.2800000000043, 1.3322408957987784, 1.9749950873616968, 3.3888357380281504], "isController": false}, {"data": ["Get Profile", 200, 0, 0.0, 1282.785, 109, 2916, 1240.0, 2091.1, 2271.0999999999995, 2888.4900000000043, 1.3433276913570296, 1.991876855471374, 0.8396322808360872], "isController": false}, {"data": ["Login", 200, 0, 0.0, 1148.1599999999999, 220, 2906, 1058.5, 1870.6, 2224.899999999999, 2833.760000000002, 1.336862650731264, 2.293737759351354, 0.9787688455856794], "isController": false}, {"data": ["Get Offers", 200, 0, 0.0, 620.5900000000004, 57, 1681, 520.5, 1180.0000000000002, 1299.35, 1593.3200000000006, 1.4111139333389777, 1.7180036530211948, 1.0458779598114751], "isController": false}, {"data": ["Update Product", 200, 0, 0.0, 1228.3249999999991, 467, 2587, 1168.0, 1794.0000000000005, 2108.5, 2429.880000000001, 1.3834224487960765, 2.9573019090365156, 5.304378067306961], "isController": false}, {"data": ["Post Offers", 200, 0, 0.0, 783.7800000000001, 94, 2347, 683.5, 1329.2, 1515.2499999999993, 1777.3700000000006, 1.4084407856282704, 4.247219209723875, 1.033966090027535], "isController": false}, {"data": ["List Category", 200, 0, 0.0, 700.2700000000003, 25, 2050, 641.0, 1169.1000000000001, 1318.4499999999998, 1858.1200000000008, 1.3953520822141448, 1.4580339140323582, 0.8758287083225775], "isController": false}, {"data": ["Update Offers", 200, 0, 0.0, 676.255, 36, 2342, 540.0, 1293.5000000000005, 1586.3499999999997, 2298.2800000000016, 1.4188422247446084, 1.694227861627412, 0.9819662936293984], "isController": false}, {"data": ["Registration", 200, 0, 0.0, 1518.07, 473, 3606, 1408.5, 2245.2000000000003, 2583.2499999999995, 2816.55, 1.3358447214095834, 2.292278233078187, 0.960921115029589], "isController": false}, {"data": ["Get Category", 200, 0, 0.0, 630.0850000000004, 41, 1640, 534.5, 1128.5000000000002, 1301.55, 1638.9, 1.4058271535514708, 1.000828120057639, 0.8851494130671634], "isController": false}, {"data": ["List Product", 200, 0, 0.0, 1377.1750000000004, 292, 2835, 1347.0, 1975.7, 2166.25, 2826.5800000000004, 1.3664655684838383, 17.921956560913618, 0.8531335617608276], "isController": false}, {"data": ["Create Product", 200, 0, 0.0, 1575.5649999999987, 444, 3055, 1510.0, 2185.2, 2474.3499999999995, 2911.2200000000016, 1.354196995036868, 2.898497328000054, 3.6888775780525296], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
