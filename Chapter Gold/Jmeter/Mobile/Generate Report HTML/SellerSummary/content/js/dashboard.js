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

    var data = {"OkPercent": 80.7375, "KoPercent": 19.2625};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1405, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06625, 500, 1500, "Patch Notification"], "isController": false}, {"data": [0.04875, 500, 1500, "RegisterSeller"], "isController": false}, {"data": [0.0025, 500, 1500, "Get Order Seller"], "isController": false}, {"data": [0.2475, 500, 1500, "History"], "isController": false}, {"data": [0.03875, 500, 1500, "List Product Seller"], "isController": false}, {"data": [0.0, 500, 1500, "Get Produk Seller"], "isController": false}, {"data": [0.1575, 500, 1500, "List Order Seller"], "isController": false}, {"data": [0.24875, 500, 1500, "Get History"], "isController": false}, {"data": [0.54, 500, 1500, "Get Banner"], "isController": false}, {"data": [0.0, 500, 1500, "Patch  Product Seller"], "isController": false}, {"data": [0.54375, 500, 1500, "List Banner"], "isController": false}, {"data": [0.1275, 500, 1500, "List Notification"], "isController": false}, {"data": [0.0425, 500, 1500, "Get  Product Seller"], "isController": false}, {"data": [0.0, 500, 1500, "Patch  Order Seller"], "isController": false}, {"data": [0.21, 500, 1500, "List Categorry"], "isController": false}, {"data": [0.215, 500, 1500, "LoginSeller"], "isController": false}, {"data": [0.22, 500, 1500, "Get Categorry"], "isController": false}, {"data": [0.005, 500, 1500, "Edit  Product Seller"], "isController": false}, {"data": [0.09, 500, 1500, "Get Notification"], "isController": false}, {"data": [0.00625, 500, 1500, "Create Product Seller"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8000, 1541, 19.2625, 3878.1038750000043, 10, 29243, 2151.5, 9322.800000000007, 13794.249999999996, 20541.89, 5.143725330211092, 4.649634471004821, 3.917175393157431], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Patch Notification", 400, 0, 0.0, 3517.8874999999985, 61, 16622, 2457.5, 6897.800000000007, 9768.649999999996, 15016.16000000001, 0.2649445272396092, 0.19481572901142574, 0.41278887750455373], "isController": false}, {"data": ["RegisterSeller", 400, 0, 0.0, 3473.6475000000023, 388, 15796, 2755.5, 6189.8, 8231.799999999997, 10493.690000000002, 0.2582457880111975, 0.14627202836571734, 0.13783616741945315], "isController": false}, {"data": ["Get Order Seller", 400, 358, 89.5, 2604.4100000000026, 167, 13282, 1929.5, 5143.500000000002, 7703.499999999998, 11220.710000000005, 0.2631132347272634, 0.09685663243508667, 0.0908948308445014], "isController": false}, {"data": ["History", 400, 0, 0.0, 2154.6849999999986, 161, 13189, 1524.0, 4377.100000000004, 5829.3499999999985, 11081.950000000013, 0.26397935681429713, 0.06857276260996391, 0.08842277283916399], "isController": false}, {"data": ["List Product Seller", 400, 0, 0.0, 4605.812500000003, 550, 16463, 3997.0, 9396.300000000003, 10100.9, 13274.120000000003, 0.26036683082795353, 0.1810363120600614, 0.08899256913064817], "isController": false}, {"data": ["Get Produk Seller", 400, 400, 100.0, 1937.4799999999993, 156, 12438, 1238.0, 3778.4, 5254.7, 7449.580000000004, 0.2609344584827183, 0.08638357561097804, 0.09224440817455472], "isController": false}, {"data": ["List Order Seller", 400, 0, 0.0, 3292.9799999999987, 368, 13805, 2070.0, 7762.9, 9519.7, 11528.0, 0.2629146986405995, 0.06829620101406199, 0.09345795928240062], "isController": false}, {"data": ["Get History", 400, 0, 0.0, 2146.897500000002, 48, 13746, 1546.5, 4302.200000000003, 6472.45, 10767.000000000007, 0.2641981750511058, 0.0686296040660099, 0.08849606840090751], "isController": false}, {"data": ["Get Banner", 400, 0, 0.0, 1046.1550000000004, 16, 8018, 727.5, 2045.1000000000004, 3203.95, 6256.1600000000035, 0.2638264865962954, 0.13397438772468123, 0.09043271171415984], "isController": false}, {"data": ["Patch  Product Seller", 400, 400, 100.0, 8711.652499999993, 150, 22233, 7797.0, 15253.800000000001, 16726.85, 19066.83, 0.2619820778060573, 0.08442781804296769, 0.45114644175941926], "isController": false}, {"data": ["List Banner", 400, 0, 0.0, 1044.1349999999995, 13, 7202, 744.0, 2064.7000000000003, 3194.049999999998, 5871.990000000001, 0.26360394035170037, 0.47520788465745983, 0.08984157732689788], "isController": false}, {"data": ["List Notification", 400, 0, 0.0, 2421.6924999999997, 239, 12932, 1896.5, 4797.800000000001, 7044.15, 9945.910000000002, 0.2643616096714051, 0.7686255713928354, 0.08984164078676658], "isController": false}, {"data": ["Get  Product Seller", 400, 0, 0.0, 3598.4050000000007, 384, 14997, 2568.5, 6667.600000000004, 9221.449999999997, 12025.99, 0.2605688347947988, 0.18117676794325852, 0.09135176922981715], "isController": false}, {"data": ["Patch  Order Seller", 400, 383, 95.75, 2595.532500000003, 110, 29243, 1534.5, 4977.300000000002, 7203.799999999994, 16978.930000000015, 0.26342964321089124, 0.08931589770730596, 0.4539138431536611], "isController": false}, {"data": ["List Categorry", 400, 0, 0.0, 2705.6175000000007, 40, 12072, 2117.0, 5451.700000000005, 6938.299999999997, 10252.350000000002, 0.2587591592656156, 0.7497445561924625, 0.08869576650608504], "isController": false}, {"data": ["LoginSeller", 400, 0, 0.0, 2417.137499999998, 455, 9957, 1749.0, 5102.800000000005, 6251.55, 8282.510000000002, 0.2586706398476947, 0.1275670635967635, 0.10774996233108808], "isController": false}, {"data": ["Get Categorry", 400, 0, 0.0, 2791.755000000001, 10, 10737, 2275.0, 5952.700000000003, 6720.6, 8775.830000000002, 0.25903866864485864, 0.09435685879348854, 0.08929750979651865], "isController": false}, {"data": ["Edit  Product Seller", 400, 0, 0.0, 10729.624999999998, 228, 24555, 9780.0, 18460.100000000002, 20751.0, 22650.56, 0.26106934001670845, 0.1697970512218045, 0.6282235944679406], "isController": false}, {"data": ["Get Notification", 400, 0, 0.0, 2592.2024999999976, 101, 13988, 1940.0, 4935.800000000008, 7638.249999999998, 12294.140000000003, 0.2645712622694923, 0.7852909126385691, 0.08991288991189776], "isController": false}, {"data": ["Create Product Seller", 400, 0, 0.0, 13174.367499999991, 266, 26548, 13092.0, 21235.6, 23271.349999999995, 25493.870000000003, 0.25903699112992584, 0.1697400596173635, 0.6226095742662291], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 400, 25.957170668397143, 5.0], "isController": false}, {"data": ["500/Internal Server Error", 400, 25.957170668397143, 5.0], "isController": false}, {"data": ["403/Forbidden", 538, 34.91239454899416, 6.725], "isController": false}, {"data": ["404/Not Found", 203, 13.17326411421155, 2.5375], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8000, 1541, "403/Forbidden", 538, "400/Bad Request", 400, "500/Internal Server Error", 400, "404/Not Found", 203, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Order Seller", 400, 358, "403/Forbidden", 261, "404/Not Found", 97, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Produk Seller", 400, 400, "500/Internal Server Error", 400, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Patch  Product Seller", 400, 400, "400/Bad Request", 400, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Patch  Order Seller", 400, 383, "403/Forbidden", 277, "404/Not Found", 106, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
