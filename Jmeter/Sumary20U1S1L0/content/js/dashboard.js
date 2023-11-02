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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8480357142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.515, 500, 1500, "Delete Product"], "isController": false}, {"data": [0.9525, 500, 1500, "Update Profile"], "isController": false}, {"data": [0.9925, 500, 1500, "Get List Category"], "isController": false}, {"data": [0.7925, 500, 1500, "Get Profile"], "isController": false}, {"data": [0.91, 500, 1500, "Offers"], "isController": false}, {"data": [0.9125, 500, 1500, "Update Product"], "isController": false}, {"data": [0.5125, 500, 1500, "Get Product"], "isController": false}, {"data": [0.9925, 500, 1500, "Update Offers"], "isController": false}, {"data": [0.9225, 500, 1500, "Registration"], "isController": false}, {"data": [0.9775, 500, 1500, "Sign_in"], "isController": false}, {"data": [0.8975, 500, 1500, "List Offers"], "isController": false}, {"data": [0.97, 500, 1500, "Get Category"], "isController": false}, {"data": [0.72, 500, 1500, "List Product"], "isController": false}, {"data": [0.805, 500, 1500, "Create Product"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2800, 0, 0.0, 424.1703571428573, 23, 2115, 327.0, 888.9000000000001, 1067.8999999999996, 1358.8399999999965, 45.73145834354125, 200.15942529950024, 24.73031646067095], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Product", 200, 0, 0.0, 906.6400000000002, 168, 2092, 892.0, 1243.4, 1385.6999999999998, 1608.6500000000003, 3.544590954203885, 42.400784683822486, 0.5607653658017865], "isController": false}, {"data": ["Update Profile", 200, 0, 0.0, 284.35499999999985, 23, 1098, 255.0, 489.9, 558.0, 864.5300000000004, 3.6054225555235075, 1.8872133689068358, 6.396649858261825], "isController": false}, {"data": ["Get List Category", 200, 0, 0.0, 202.5549999999999, 51, 771, 174.0, 326.0, 415.9999999999998, 646.0600000000009, 3.5169782123199744, 3.6749674679515363, 1.1278028667768654], "isController": false}, {"data": ["Get Profile", 200, 0, 0.0, 486.1750000000002, 33, 1303, 461.0, 807.7, 899.9, 1279.810000000001, 3.63167547347969, 13.317059596929418, 0.6206476639247517], "isController": false}, {"data": ["Offers", 200, 0, 0.0, 384.5750000000002, 129, 1860, 310.0, 650.9000000000001, 883.4499999999996, 1365.9500000000028, 3.497604141163303, 12.829905362482949, 0.5977350827183379], "isController": false}, {"data": ["Update Product", 200, 0, 0.0, 337.6649999999999, 38, 940, 322.0, 560.9, 619.75, 800.6300000000003, 3.5190203047471584, 2.4468188056445084, 10.513623007354752], "isController": false}, {"data": ["Get Product", 200, 0, 0.0, 913.37, 285, 1599, 898.0, 1261.4, 1377.9999999999998, 1579.2800000000007, 3.4771119108468507, 41.59354205240877, 0.5500899702706932], "isController": false}, {"data": ["Update Offers", 200, 0, 0.0, 188.91499999999996, 29, 892, 159.5, 326.70000000000005, 398.39999999999986, 838.3700000000015, 3.4887574790238456, 1.8261464929265443, 1.114630758630314], "isController": false}, {"data": ["Registration", 200, 0, 0.0, 334.2250000000001, 69, 1409, 264.0, 613.6000000000001, 932.4499999999996, 1287.5700000000004, 3.4622442267077522, 12.002322678998027, 1.0993301639372641], "isController": false}, {"data": ["Sign_in", 200, 0, 0.0, 234.77999999999994, 39, 896, 204.0, 410.0, 496.5999999999999, 724.5100000000014, 3.498215909885958, 10.856323626512978, 1.1408146688938643], "isController": false}, {"data": ["List Offers", 200, 0, 0.0, 388.2100000000001, 110, 1125, 341.5, 665.7, 789.0999999999996, 1081.800000000002, 3.480742790511495, 12.765352251170398, 0.5948535042378044], "isController": false}, {"data": ["Get Category", 200, 0, 0.0, 216.55499999999998, 48, 969, 173.0, 382.8, 559.4999999999999, 962.2900000000006, 3.520816829504445, 2.5065190124108794, 1.140792788927031], "isController": false}, {"data": ["List Product", 200, 0, 0.0, 599.4949999999999, 179, 2115, 538.0, 898.9000000000001, 1092.5499999999997, 1265.2100000000007, 3.467226045802056, 43.729101836763, 0.6975083646828355], "isController": false}, {"data": ["Create Product", 200, 0, 0.0, 460.86999999999995, 147, 1863, 435.0, 728.0, 975.5499999999995, 1381.6800000000012, 3.475782485532055, 12.748789993222225, 0.5940057958672946], "isController": false}]}, function(index, item){
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
