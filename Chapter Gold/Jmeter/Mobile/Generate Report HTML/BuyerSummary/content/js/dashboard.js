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

    var data = {"OkPercent": 90.98214285714286, "KoPercent": 9.017857142857142};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06473214285714286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13875, 500, 1500, "Get Buyer Order"], "isController": false}, {"data": [0.17375, 500, 1500, "LoginBuyer"], "isController": false}, {"data": [0.0025, 500, 1500, "Buyer Order"], "isController": false}, {"data": [0.1175, 500, 1500, "History"], "isController": false}, {"data": [0.11875, 500, 1500, "Get History"], "isController": false}, {"data": [0.10125, 500, 1500, "List  Buyer Order"], "isController": false}, {"data": [0.08875, 500, 1500, "Get  Order"], "isController": false}, {"data": [0.0275, 500, 1500, "Buyer Wishlist"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Wishlist"], "isController": false}, {"data": [0.005, 500, 1500, "Delete  Buyer Order"], "isController": false}, {"data": [0.00375, 500, 1500, "Edit Buyer Order"], "isController": false}, {"data": [0.04125, 500, 1500, "Get Wishlist"], "isController": false}, {"data": [0.0175, 500, 1500, "RegisterBuyer"], "isController": false}, {"data": [0.07, 500, 1500, "List  Wishlist"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5600, 505, 9.017857142857142, 4539.758928571437, 430, 27536, 2880.5, 10296.30000000001, 13480.95, 20005.769999999997, 4.39277357370172, 2.9007273986896984, 3.6382734995246393], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Buyer Order", 400, 0, 0.0, 3415.1375000000007, 900, 16017, 2139.5, 7744.700000000001, 10446.699999999995, 13775.540000000003, 0.32171072897238356, 0.35227089194500677, 0.11077263833159207], "isController": false}, {"data": ["LoginBuyer", 400, 0, 0.0, 2538.6850000000018, 560, 9764, 2062.0, 4718.700000000001, 5453.949999999998, 8384.220000000012, 0.325434495731113, 0.1604925979923946, 0.1355447387005075], "isController": false}, {"data": ["Buyer Order", 400, 33, 8.25, 10378.779999999997, 1196, 27536, 8194.5, 19957.900000000005, 22837.55, 26410.73, 0.3209409990090947, 0.2022946905326417, 0.6056037552102765], "isController": false}, {"data": ["History", 400, 0, 0.0, 3854.9449999999983, 783, 14762, 2263.5, 9054.9, 10696.499999999995, 13540.42, 0.32155736663810164, 0.092146282877231, 0.10770915698912976], "isController": false}, {"data": ["Get History", 400, 0, 0.0, 3567.415000000001, 721, 15183, 2083.0, 8348.0, 10485.399999999998, 13278.780000000002, 0.322278379229803, 0.09420348092877406, 0.10795066804279535], "isController": false}, {"data": ["List  Buyer Order", 400, 0, 0.0, 4029.7125000000015, 938, 16023, 2513.5, 9787.900000000001, 11249.999999999996, 15990.110000000002, 0.32131765945790497, 0.3526814322674423, 0.10888401155458304], "isController": false}, {"data": ["Get  Order", 400, 0, 0.0, 4297.542500000002, 849, 15266, 3050.0, 9007.0, 10278.099999999999, 13495.97, 0.3208478082485159, 0.35233804931150076, 0.10872479439671388], "isController": false}, {"data": ["Buyer Wishlist", 400, 0, 0.0, 4554.9925, 701, 21175, 2696.0, 10549.7, 13704.449999999992, 17788.350000000002, 0.32091216072564654, 0.22971544317568257, 0.5509880033005816], "isController": false}, {"data": ["Delete Wishlist", 400, 400, 100.0, 2150.6575, 430, 11029, 1158.0, 5491.100000000008, 6785.8499999999985, 9522.470000000003, 0.3222080271685808, 0.14474188720463593, 0.5008855937971732], "isController": false}, {"data": ["Delete  Buyer Order", 400, 33, 8.25, 4540.0875000000015, 672, 19184, 2831.0, 10483.7, 11055.9, 14281.700000000003, 0.3221766252803943, 0.10423625136421664, 0.5013763611962417], "isController": false}, {"data": ["Edit Buyer Order", 400, 39, 9.75, 7621.097500000003, 744, 25992, 4783.5, 17681.9, 19947.8, 24227.440000000002, 0.32119020241406554, 0.20244078958990436, 0.49911671439686905], "isController": false}, {"data": ["Get Wishlist", 400, 0, 0.0, 3853.7649999999994, 569, 15535, 2405.0, 8315.6, 9345.15, 11780.91, 0.32108346404106014, 0.25147357242278345, 0.11005888269376184], "isController": false}, {"data": ["RegisterBuyer", 400, 0, 0.0, 4702.944999999999, 1070, 14932, 3727.5, 9162.2, 10737.75, 13515.84, 0.32526618971801047, 0.18423280276996687, 0.1735917701961843], "isController": false}, {"data": ["List  Wishlist", 400, 0, 0.0, 4050.862499999999, 656, 17269, 2135.5, 9526.7, 12724.199999999999, 16484.500000000007, 0.3212183168320807, 0.2515791895501257, 0.10979141688596508], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 33, 6.534653465346534, 0.5892857142857143], "isController": false}, {"data": ["500/Internal Server Error", 6, 1.188118811881188, 0.10714285714285714], "isController": false}, {"data": ["404/Not Found", 466, 92.27722772277228, 8.321428571428571], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5600, 505, "404/Not Found", 466, "400/Bad Request", 33, "500/Internal Server Error", 6, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Buyer Order", 400, 33, "400/Bad Request", 33, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Wishlist", 400, 400, "404/Not Found", 400, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete  Buyer Order", 400, 33, "404/Not Found", 33, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Edit Buyer Order", 400, 39, "404/Not Found", 33, "500/Internal Server Error", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
