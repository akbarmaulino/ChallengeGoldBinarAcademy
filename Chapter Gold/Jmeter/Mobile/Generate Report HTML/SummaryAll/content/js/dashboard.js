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

    var data = {"OkPercent": 81.0060975609756, "KoPercent": 18.99390243902439};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.09353658536585366, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0075, 500, 1500, "ChangePassword"], "isController": false}, {"data": [0.01125, 500, 1500, "UpdateProfile"], "isController": false}, {"data": [0.0025, 500, 1500, "Buyer Order"], "isController": false}, {"data": [0.0025, 500, 1500, "Get Order Seller"], "isController": false}, {"data": [0.1825, 500, 1500, "History"], "isController": false}, {"data": [0.03875, 500, 1500, "List Product Seller"], "isController": false}, {"data": [0.18375, 500, 1500, "Get History"], "isController": false}, {"data": [0.1575, 500, 1500, "List Order Seller"], "isController": false}, {"data": [0.0, 500, 1500, "Patch  Product Seller"], "isController": false}, {"data": [0.54375, 500, 1500, "List Banner"], "isController": false}, {"data": [0.1275, 500, 1500, "List Notification"], "isController": false}, {"data": [0.0, 500, 1500, "Patch  Order Seller"], "isController": false}, {"data": [0.21, 500, 1500, "List Categorry"], "isController": false}, {"data": [0.005, 500, 1500, "Delete  Buyer Order"], "isController": false}, {"data": [0.134375, 500, 1500, "LoginSeller"], "isController": false}, {"data": [0.22, 500, 1500, "Get Categorry"], "isController": false}, {"data": [0.00375, 500, 1500, "Edit Buyer Order"], "isController": false}, {"data": [0.0175, 500, 1500, "RegisterBuyer"], "isController": false}, {"data": [0.005, 500, 1500, "Edit  Product Seller"], "isController": false}, {"data": [0.09, 500, 1500, "Get Notification"], "isController": false}, {"data": [0.00625, 500, 1500, "Create Product Seller"], "isController": false}, {"data": [0.13875, 500, 1500, "Get Buyer Order"], "isController": false}, {"data": [0.17375, 500, 1500, "LoginBuyer"], "isController": false}, {"data": [0.06625, 500, 1500, "Patch Notification"], "isController": false}, {"data": [0.03375, 500, 1500, "RegisterSeller"], "isController": false}, {"data": [0.0, 500, 1500, "Get Produk Seller"], "isController": false}, {"data": [0.10125, 500, 1500, "List  Buyer Order"], "isController": false}, {"data": [0.54, 500, 1500, "Get Banner"], "isController": false}, {"data": [0.08875, 500, 1500, "Get  Order"], "isController": false}, {"data": [0.0275, 500, 1500, "Buyer Wishlist"], "isController": false}, {"data": [0.0275, 500, 1500, "Get User"], "isController": false}, {"data": [0.0, 500, 1500, "Create Product Delete  Seller"], "isController": false}, {"data": [0.0425, 500, 1500, "Get  Product Seller"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Wishlist"], "isController": false}, {"data": [0.04125, 500, 1500, "Get Wishlist"], "isController": false}, {"data": [0.07, 500, 1500, "List  Wishlist"], "isController": false}, {"data": [0.0, 500, 1500, "Delete  Product Seller"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 16400, 3115, 18.99390243902439, 4314.171829268322, 7, 29243, 2476.5, 10497.0, 14731.499999999989, 20401.85, 7.074493990346767, 5.227935043500589, 5.441851538373522], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ChangePassword", 400, 157, 39.25, 4825.2049999999945, 7, 20497, 4697.5, 10737.0, 11689.749999999998, 20486.200000000008, 0.5645276244536431, 0.17344201622099562, 0.23676944612430614], "isController": false}, {"data": ["UpdateProfile", 400, 157, 39.25, 4588.4525, 7, 14303, 4279.5, 10272.300000000001, 11394.899999999998, 13657.300000000001, 0.5666966543646268, 0.261520267817297, 0.27420453277631773], "isController": false}, {"data": ["Buyer Order", 400, 33, 8.25, 10378.779999999995, 1196, 27536, 8194.5, 19957.900000000005, 22837.55, 26410.73, 0.3209409990090947, 0.2022946905326417, 0.6056037552102765], "isController": false}, {"data": ["Get Order Seller", 400, 358, 89.5, 2604.4100000000026, 167, 13282, 1929.5, 5143.500000000002, 7703.499999999998, 11220.710000000005, 0.2631132347272634, 0.09685663243508667, 0.0908948308445014], "isController": false}, {"data": ["History", 800, 0, 0.0, 3004.8149999999996, 161, 14762, 1789.0, 7462.0999999999985, 9245.349999999995, 12803.25, 0.5236760487594768, 0.14304947691308678, 0.1754110202387701], "isController": false}, {"data": ["List Product Seller", 400, 0, 0.0, 4605.812500000004, 550, 16463, 3997.0, 9396.300000000003, 10100.9, 13274.120000000003, 0.26036683082795353, 0.1810363120600614, 0.08899256913064817], "isController": false}, {"data": ["Get History", 800, 0, 0.0, 2857.1562500000023, 48, 15183, 1782.5, 6505.9, 8812.849999999991, 12793.950000000003, 0.5254077328196598, 0.14503100562383303, 0.17599106675502274], "isController": false}, {"data": ["List Order Seller", 400, 0, 0.0, 3292.9799999999987, 368, 13805, 2070.0, 7762.9, 9519.7, 11528.0, 0.2629146986405995, 0.06829620101406199, 0.09345795928240062], "isController": false}, {"data": ["Patch  Product Seller", 400, 400, 100.0, 8711.652499999991, 150, 22233, 7797.0, 15253.800000000001, 16726.85, 19066.83, 0.2619820778060573, 0.08442781804296769, 0.45114644175941926], "isController": false}, {"data": ["List Banner", 400, 0, 0.0, 1044.1349999999995, 13, 7202, 744.0, 2064.7000000000003, 3194.049999999998, 5871.990000000001, 0.26360394035170037, 0.47520788465745983, 0.08984157732689788], "isController": false}, {"data": ["List Notification", 400, 0, 0.0, 2421.6924999999997, 239, 12932, 1896.5, 4797.800000000001, 7044.15, 9945.910000000002, 0.2643616096714051, 0.7686255713928354, 0.08984164078676658], "isController": false}, {"data": ["Patch  Order Seller", 400, 383, 95.75, 2595.532500000003, 110, 29243, 1534.5, 4977.300000000002, 7203.799999999994, 16978.930000000015, 0.26342964321089124, 0.08931589770730596, 0.4539138431536611], "isController": false}, {"data": ["List Categorry", 400, 0, 0.0, 2705.617500000001, 40, 12072, 2117.0, 5451.700000000005, 6938.299999999997, 10252.350000000002, 0.2587591592656156, 0.7497445561924625, 0.08869576650608504], "isController": false}, {"data": ["Delete  Buyer Order", 400, 33, 8.25, 4540.0875000000015, 672, 19184, 2831.0, 10483.7, 11055.9, 14281.700000000003, 0.3221766252803943, 0.10423625136421664, 0.5013763611962417], "isController": false}, {"data": ["LoginSeller", 800, 141, 17.625, 2396.176249999998, 8, 9957, 1850.0, 5476.9, 6289.449999999998, 8133.330000000002, 0.34571287940367984, 0.1591279415574538, 0.1350900929114167], "isController": false}, {"data": ["Get Categorry", 400, 0, 0.0, 2791.755000000001, 10, 10737, 2275.0, 5952.700000000003, 6720.6, 8775.830000000002, 0.25903866864485864, 0.09435685879348854, 0.08929750979651865], "isController": false}, {"data": ["Edit Buyer Order", 400, 39, 9.75, 7621.097500000003, 744, 25992, 4783.5, 17681.9, 19947.8, 24227.440000000002, 0.32119020241406554, 0.20244078958990436, 0.49911671439686905], "isController": false}, {"data": ["RegisterBuyer", 400, 0, 0.0, 4702.944999999998, 1070, 14932, 3727.5, 9162.2, 10737.75, 13515.84, 0.32526618971801047, 0.18423280276996687, 0.1735917701961843], "isController": false}, {"data": ["Edit  Product Seller", 400, 0, 0.0, 10729.625, 228, 24555, 9780.0, 18460.100000000002, 20751.0, 22650.56, 0.26106934001670845, 0.1697970512218045, 0.6282235944679406], "isController": false}, {"data": ["Get Notification", 400, 0, 0.0, 2592.2024999999976, 101, 13988, 1940.0, 4935.800000000008, 7638.249999999998, 12294.140000000003, 0.2645712622694923, 0.7852909126385691, 0.08991288991189776], "isController": false}, {"data": ["Create Product Seller", 400, 0, 0.0, 13174.367499999991, 266, 26548, 13092.0, 21235.6, 23271.349999999995, 25493.870000000003, 0.25903699112992584, 0.1697400596173635, 0.6226095742662291], "isController": false}, {"data": ["Get Buyer Order", 400, 0, 0.0, 3415.137500000001, 900, 16017, 2139.5, 7744.700000000001, 10446.699999999995, 13775.540000000003, 0.32171072897238356, 0.35227089194500677, 0.11077263833159207], "isController": false}, {"data": ["LoginBuyer", 400, 0, 0.0, 2538.6850000000018, 560, 9764, 2062.0, 4718.700000000001, 5453.949999999998, 8384.220000000012, 0.325434495731113, 0.1604925979923946, 0.1355447387005075], "isController": false}, {"data": ["Patch Notification", 400, 0, 0.0, 3517.8874999999985, 61, 16622, 2457.5, 6897.800000000007, 9768.649999999996, 15016.16000000001, 0.2649445272396092, 0.19481572901142574, 0.41278887750455373], "isController": false}, {"data": ["RegisterSeller", 800, 141, 17.625, 3811.534999999997, 9, 19050, 3004.5, 8255.3, 9292.599999999999, 11515.86, 0.3452427704006111, 0.17974117446196072, 0.17667183474415352], "isController": false}, {"data": ["Get Produk Seller", 400, 400, 100.0, 1937.4799999999993, 156, 12438, 1238.0, 3778.4, 5254.7, 7449.580000000004, 0.2609344584827183, 0.08638357561097804, 0.09224440817455472], "isController": false}, {"data": ["List  Buyer Order", 400, 0, 0.0, 4029.7125000000015, 938, 16023, 2513.5, 9787.900000000001, 11249.999999999996, 15990.110000000002, 0.32131765945790497, 0.3526814322674423, 0.10888401155458304], "isController": false}, {"data": ["Get Banner", 400, 0, 0.0, 1046.1550000000007, 16, 8018, 727.5, 2045.1000000000004, 3203.95, 6256.1600000000035, 0.2638264865962954, 0.13397438772468123, 0.09043271171415984], "isController": false}, {"data": ["Get  Order", 400, 0, 0.0, 4297.542500000003, 849, 15266, 3050.0, 9007.0, 10278.099999999999, 13495.97, 0.3208478082485159, 0.35233804931150076, 0.10872479439671388], "isController": false}, {"data": ["Buyer Wishlist", 400, 0, 0.0, 4554.992500000001, 701, 21175, 2696.0, 10549.7, 13704.449999999992, 17788.350000000002, 0.32091216072564654, 0.22971544317568257, 0.5509880033005816], "isController": false}, {"data": ["Get User", 400, 149, 37.25, 3371.9824999999983, 7, 20267, 2964.5, 7895.500000000001, 9244.8, 12670.810000000001, 0.5633985326285218, 0.2628702562723863, 0.16091933039732273], "isController": false}, {"data": ["Create Product Delete  Seller", 400, 143, 35.75, 8809.662499999999, 11, 23072, 10456.0, 18180.7, 18949.25, 21478.400000000005, 0.5592372004585745, 0.29675206611931326, 1.3153966193237425], "isController": false}, {"data": ["Get  Product Seller", 400, 0, 0.0, 3598.4050000000016, 384, 14997, 2568.5, 6667.600000000004, 9221.449999999997, 12025.99, 0.2605688347947988, 0.18117676794325852, 0.09135176922981715], "isController": false}, {"data": ["Delete Wishlist", 400, 400, 100.0, 2150.6575000000003, 430, 11029, 1158.0, 5491.100000000008, 6785.8499999999985, 9522.470000000003, 0.3222080271685808, 0.14474188720463593, 0.5008855937971732], "isController": false}, {"data": ["Get Wishlist", 400, 0, 0.0, 3853.764999999999, 569, 15535, 2405.0, 8315.6, 9345.15, 11780.91, 0.32108346404106014, 0.25147357242278345, 0.11005888269376184], "isController": false}, {"data": ["List  Wishlist", 400, 0, 0.0, 4050.8625, 656, 17269, 2135.5, 9526.7, 12724.199999999999, 16484.500000000007, 0.3212183168320807, 0.2515791895501257, 0.10979141688596508], "isController": false}, {"data": ["Delete  Product Seller", 400, 181, 45.25, 7642.4025000000065, 7, 25140, 6327.5, 18444.100000000006, 20006.9, 21830.110000000004, 0.5610885117127227, 0.1719799301269463, 0.17736205112919062], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 433, 13.90048154093098, 2.6402439024390243], "isController": false}, {"data": ["502/Bad Gateway", 1034, 33.19422150882825, 6.304878048780488], "isController": false}, {"data": ["500/Internal Server Error", 406, 13.03370786516854, 2.475609756097561], "isController": false}, {"data": ["403/Forbidden", 573, 18.39486356340289, 3.4939024390243905], "isController": false}, {"data": ["404/Not Found", 669, 21.47672552166934, 4.079268292682927], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 16400, 3115, "502/Bad Gateway", 1034, "404/Not Found", 669, "403/Forbidden", 573, "400/Bad Request", 433, "500/Internal Server Error", 406], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ChangePassword", 400, 157, "502/Bad Gateway", 157, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["UpdateProfile", 400, 157, "502/Bad Gateway", 157, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Buyer Order", 400, 33, "400/Bad Request", 33, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Order Seller", 400, 358, "403/Forbidden", 261, "404/Not Found", 97, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Patch  Product Seller", 400, 400, "400/Bad Request", 400, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Patch  Order Seller", 400, 383, "403/Forbidden", 277, "404/Not Found", 106, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete  Buyer Order", 400, 33, "404/Not Found", 33, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LoginSeller", 800, 141, "502/Bad Gateway", 141, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Edit Buyer Order", 400, 39, "404/Not Found", 33, "500/Internal Server Error", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["RegisterSeller", 800, 141, "502/Bad Gateway", 141, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Produk Seller", 400, 400, "500/Internal Server Error", 400, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User", 400, 149, "502/Bad Gateway", 149, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create Product Delete  Seller", 400, 143, "502/Bad Gateway", 143, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Wishlist", 400, 400, "404/Not Found", 400, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete  Product Seller", 400, 181, "502/Bad Gateway", 146, "403/Forbidden", 35, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
