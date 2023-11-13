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

    var data = {"OkPercent": 61.82142857142857, "KoPercent": 38.17857142857143};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.016964285714285713, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0075, 500, 1500, "ChangePassword"], "isController": false}, {"data": [0.0275, 500, 1500, "Get User"], "isController": false}, {"data": [0.01125, 500, 1500, "UpdateProfile"], "isController": false}, {"data": [0.0, 500, 1500, "Create Product Delete  Seller"], "isController": false}, {"data": [0.01875, 500, 1500, "RegisterSeller"], "isController": false}, {"data": [0.05375, 500, 1500, "LoginSeller"], "isController": false}, {"data": [0.0, 500, 1500, "Delete  Product Seller"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2800, 1069, 38.17857142857143, 5108.906071428573, 7, 25140, 3717.5, 13767.7, 17041.799999999996, 20243.639999999992, 3.906762326532777, 1.660205030026259, 2.6297066893537937], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ChangePassword", 400, 157, 39.25, 4825.204999999994, 7, 20497, 4697.5, 10737.0, 11689.749999999998, 20486.200000000008, 0.5645276244536431, 0.17344201622099562, 0.23676944612430614], "isController": false}, {"data": ["Get User", 400, 149, 37.25, 3371.9824999999983, 7, 20267, 2964.5, 7895.500000000001, 9244.8, 12670.810000000001, 0.5633985326285218, 0.2628702562723863, 0.16091933039732273], "isController": false}, {"data": ["UpdateProfile", 400, 157, 39.25, 4588.4525, 7, 14303, 4279.5, 10272.300000000001, 11394.899999999998, 13657.300000000001, 0.5666966543646268, 0.261520267817297, 0.27420453277631773], "isController": false}, {"data": ["Create Product Delete  Seller", 400, 143, 35.75, 8809.662499999999, 11, 23072, 10456.0, 18180.7, 18949.25, 21478.400000000005, 0.5592372004585745, 0.29675206611931326, 1.3153966193237425], "isController": false}, {"data": ["RegisterSeller", 400, 141, 35.25, 4149.422500000002, 9, 19050, 3984.5, 9008.400000000007, 9888.999999999998, 14994.910000000029, 0.5588707457710949, 0.26537355182618, 0.27369248477775804], "isController": false}, {"data": ["LoginSeller", 400, 141, 35.25, 2375.2150000000024, 8, 8794, 2008.5, 5714.6, 6313.799999999999, 7965.560000000002, 0.5591887289919784, 0.2390053994040446, 0.20408340797920377], "isController": false}, {"data": ["Delete  Product Seller", 400, 181, 45.25, 7642.402500000004, 7, 25140, 6327.5, 18444.100000000006, 20006.9, 21830.110000000004, 0.5610885117127227, 0.1719799301269463, 0.17736205112919062], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 1034, 96.72591206735267, 36.92857142857143], "isController": false}, {"data": ["403/Forbidden", 35, 3.2740879326473338, 1.25], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2800, 1069, "502/Bad Gateway", 1034, "403/Forbidden", 35, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ChangePassword", 400, 157, "502/Bad Gateway", 157, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get User", 400, 149, "502/Bad Gateway", 149, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["UpdateProfile", 400, 157, "502/Bad Gateway", 157, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create Product Delete  Seller", 400, 143, "502/Bad Gateway", 143, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["RegisterSeller", 400, 141, "502/Bad Gateway", 141, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LoginSeller", 400, 141, "502/Bad Gateway", 141, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete  Product Seller", 400, 181, "502/Bad Gateway", 146, "403/Forbidden", 35, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
