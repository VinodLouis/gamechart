function gridcontroller($scope, $http){
    var svg;
    $scope.persistData = [];
    $scope.arrDataType = [];
    $scope.arrHeaderOptions = [];
    $scope.AllData = [];
    $scope.IsSortingNow = true;
    $scope.intTotalVisibleCols = 0;
    $scope.selectedData = [];
    $scope.myfilter = {
        field : "",
        value : "",
        type: ""
    };
    var dataType ={
        NUMBER : "NUMBER",
        TEXT : "TEXT",
        DATE : "DATE"
    };
    $scope.filterOptions = {filterText:""};
    $scope.arrfilterOptions = [];
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5,10,15, 50, 100,250, 500, 1000, 2000],
        pageSize: 10,
        currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize){
        $scope.AllData = data;
        if($scope.manualsorting.field != ""){
            switch($scope.manualsorting.type){
                case dataType.DATE:
                    if($scope.manualsorting.isASC){
                        data.sort(function(a, b) {
                            if(Date.parse(new Date(a[$scope.manualsorting.field])) > Date.parse(new Date(b[$scope.manualsorting.field])))
                                return 1;
                            else if(Date.parse(new Date(a[$scope.manualsorting.field])) < Date.parse(new Date(b[$scope.manualsorting.field])))
                                return -1;
                            else
                                return 0;
                        });
                    }else{
                        data.sort(function(a, b) {
                            if(Date.parse(new Date(a[$scope.manualsorting.field])) < Date.parse(new Date(b[$scope.manualsorting.field])))
                                return 1;
                            else if(Date.parse(new Date(a[$scope.manualsorting.field])) > Date.parse(new Date(b[$scope.manualsorting.field])))
                                return -1;
                            else
                                return 0;
                        });
                    }
                    break;
                case dataType.TEXT:
                    if($scope.manualsorting.isASC){
                        data.sort(function(a, b) {
                            if(a[$scope.manualsorting.field] > b[$scope.manualsorting.field])
                                return 1;
                            else if(a[$scope.manualsorting.field] < b[$scope.manualsorting.field])
                                return -1;
                            else
                                return 0;
                        });
                    }else{
                        data.sort(function(a, b) {
                            if(a[$scope.manualsorting.field] > b[$scope.manualsorting.field])
                                return -1;
                            else if(a[$scope.manualsorting.field] < b[$scope.manualsorting.field])
                                return 1;
                            else
                                return 0;
                        });
                    }
                    break;
                case dataType.NUMBER:
                    if($scope.manualsorting.isASC){
                        data.sort(function(a, b) {
                            if(parseInt(a[$scope.manualsorting.field],10) > parseInt(b[$scope.manualsorting.field],10))
                                return 1;
                            else if(parseInt(a[$scope.manualsorting.field],10) < parseInt(b[$scope.manualsorting.field],10))
                                return -1;
                            else
                                return 0;
                        });
                    }
                    else{
                        data.sort(function(a, b) {
                            if(parseInt(a[$scope.manualsorting.field],10) > parseInt(b[$scope.manualsorting.field],10))
                                return -1;
                            else if(parseInt(a[$scope.manualsorting.field],10) < parseInt(b[$scope.manualsorting.field],10))
                                return 1;
                            else
                                return 0;
                        });
                    }
                    break;
            }
        }
        if($scope.myfilter.field != ""){
            switch($scope.myfilter.type){
                case dataType.DATE:
                case dataType.NUMBER:
                    data = data.filter(function (el) {
                        return (el[$scope.myfilter.field].toString().indexOf($scope.myfilter.value) >= 0);
                    });
                    break;
                case dataType.TEXT:
                    data = data.filter(function (el) {
                        return (el[$scope.myfilter.field].toString().toLowerCase().indexOf($scope.myfilter.value.toString().toLowerCase()) >= 0);
                    });
                    break;
            }
        }
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('json/sample_ptab_docket.json').success(function (largeLoad) {
                    angular.forEach(largeLoad.data,function(element){
                        element.fillingdate = $scope.GetDateFormat(element.fillingdate);
                    });
                    data = largeLoad.data.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });
            } else {
                $http.get('json/sample_ptab_docket.json').success(function (largeLoad) {
                    angular.forEach(largeLoad.data,function(element){
                        element.fillingdate = $scope.GetDateFormat(element.fillingdate);
                    });
                    $scope.setPagingData(largeLoad.data,page,pageSize);
                });
            }
        }, 100);
    };
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('pagingOptions.pageSize', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    },true);

    /********************************************** Manual sorting Logic ***************************************************/
    $scope.sortingData = [];
    $scope.manualsorting = {field : "",isASC : "",type:""};

    $scope.fnGetTemplate = function(){
        var myHeaderCellTemplate = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{cursor: col.cursor}" ng-class="{ ngSorted: !noSortVisible }">'+
            '<div ng-click="sortByColumn(col.field)" ng-class="\'colt\' + col.index" class="ngHeaderText">{{col.displayName}}</div>'+
            '<div class="ngSortButtonDown" ng-show="sortingData[col.field].down"></div>'+
            '<div class="ngSortButtonUp" ng-show="sortingData[col.field].up"></div>'+
            '<div class="ngSortPriority">{{col.sortPriority}}</div>'+
            '<div ng-show="col.pinnable" ng-click="togglePin(col)" ng-class="{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }" class="ngPinnedIcon"></div>'+
            '<!--<input type="text" size="5" ng-model="arrfilterOptions[col.field]" ng-change="filterByColumn(col.field,arrfilterOptions[col.field])"/>-->'+
            '</div>'+
            '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

        return myHeaderCellTemplate;
    }

    $scope.sortByColumn = function(colName){
        $scope.manualsorting.field = colName;
        $scope.manualsorting.type = $scope.arrDataType[colName];
        if($scope.sortingData[colName].down){
            $scope.manualsorting.isASC = true;
            $scope.sortingData[colName].down = false;
            $scope.sortingData[colName].up = true;
        }
        else{
            $scope.manualsorting.isASC = false;
            $scope.sortingData[colName].down = true;
            $scope.sortingData[colName].up = false;
        }
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    }

    $scope.filterByColumn = function(colName,searchText){
        $scope.myfilter.field = colName;
        $scope.myfilter.type = $scope.arrDataType[colName];
        if(searchText == ""){
            $scope.myfilter.value = "";
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
        else{
            $scope.myfilter.value = searchText.trim();
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }

    $scope.gridOptions = {
        data: 'myData',
        enablePaging: false,
        showFooter: true,
        //enablePinning: true,
        rowHeight: 30,
        multiSelect: false,
        totalServerItems: 'totalServerItems',
        //showColumnMenu: true,
        selectedItems:$scope.selectedData,
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        headerRowHeight: 40,
        //showColumnMenu: true,
        columnDefs: 'HeaderOptions',
        enableColumnResize: true,
        afterSelectionChange: function (data) {
            if(data.selected){
                $(".caption_wrapper").remove();
                $(".label_wrapper").remove();
                $(".other-line").hide();
                $(".other-label").hide();
                $(".other-caption").hide();

                    $("#line_" + data.entity.id).show();
                    $("#label_" + data.entity.id).show();
                    $("#caption_" + data.entity.id).show();

                    var text = d3.select("#caption_" + data.entity.id);
                    var bbox = text.node().getBBox();
                    var padding = 2;
                    var isTimeline = true;
                    if(!data.entity.hasOwnProperty('timeline') || data.entity.timeline == "")
                        isTimeline = false
                    var rect = svg.insert("rect", "text")
                        .attr("transform",fngetPadding(text.attr("transform").split(" ")[0],bbox.width,bbox.height,isTimeline))
                        .attr("id","caption_wrapper_" + data.entity.id)
                        .attr("class","caption_wrapper")
                        .attr("height", bbox.width + (padding*2))
                        .attr("width", bbox.height + (padding*2))
                        .style("fill", "#CBD6EE");

                    var text = d3.select("#label_" + data.entity.id);
                    var bbox = text.node().getBBox();
                    var padding = 2;
                    var rect = svg.insert("rect", "text")
                        .attr("transform",fngetPadding(text.attr("transform").split(" ")[0],bbox.width,bbox.height))
                        .attr("id","label_wrapper_" + data.entity.id)
                        .attr("class","label_wrapper")
                        .attr("height", bbox.width + (padding*2))
                        .attr("width", bbox.height + (padding*2))
                        .style("fill", "#CBD6EE");

            }else{
                $("#caption_wrapper_" + data.entity.id).remove();
                $("#label_wrapper_" + data.entity.id).remove();
                if(!data.entity.hasOwnProperty('timeline') || data.entity.timeline == ""){
                    $("#line_" + data.entity.id).hide();
                    $("#label_" + data.entity.id).hide();
                    $("#caption_" + data.entity.id).hide();
                }
            }
        }
    };

    function fngetPadding(value,width,height,reverseheight){
        var strXY = value.substring(value.indexOf("(") + 1,value.indexOf(")"));
        var arrXY = strXY.split(",");
        arrXY[0] = arrXY[0] - height;
        if(arguments.length == 4){
            if(reverseheight)
                return "translate(" + arrXY[0] + "," + (arrXY[1]-2) + ")";
            else
                return "translate(" + arrXY[0] + "," + (arrXY[1] - width - 2) + ")";
        }else
            return "translate(" + arrXY[0] + "," + (arrXY[1]-2) + ")";

    }

    $scope.setHeaders = function(header){
        angular.forEach(header,function(element){
            if(!element.hidden){
                $scope.intTotalVisibleCols++;
                $scope.arrfilterOptions["filter" + element.name] = "";
                $scope.arrDataType[element.name] = element.dataType;
                $scope.sortingData[element.name] = {down:false,up:true};
                $scope.arrHeaderOptions.push({
                    field:element.name,
                    abc:element.dataType,
                    width:element.width,
                    displayName:element.displayName,
                    enableCellEdit:false,
                    headerCellTemplate:$scope.fnGetTemplate(),
                    colFilterText: '',
                    pinned:element.pinned
                })
            }
        });
    }
    $(".gridStyle").css("height",500);
    $(".gridStyle").css("width",1220);
    $http.get('json/sample_ptab_docket.json').success(function (largeLoad) {
        largeLoad.data.sort(function(a, b) {
            if(Date.parse(new Date(a.fillingdate)) > Date.parse(new Date(b.fillingdate)))
                return 1;
            else if(Date.parse(new Date(a.fillingdate)) < Date.parse(new Date(b.fillingdate)))
                return -1;
            else
                return 0;
        });
        $scope.setHeaders(largeLoad.header);
        $scope.HeaderOptions = $scope.arrHeaderOptions;
        $scope.pagingOptions.pageSize = largeLoad.data.length;
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        $scope.persistData = JSON.stringify(largeLoad.data);
        $scope.myData = largeLoad.data;
        $scope.totalServerItems = largeLoad.data.length;
        angular.forEach(largeLoad.data,function(element){
            element.fillingdate = $scope.GetDateFormat(element.fillingdate);
        });
        console.log(largeLoad.data);
        $scope.drawChart(largeLoad.data);
    });

    $scope.GetDateFormat = function(dateString){
        var date = new Date(dateString);
        var year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getDate();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        return year + "-" + month + "-" + day;
    }

    $scope.drawChart = function(data){
        var chartData = data.filter(function(ele){
            return (ele.hasOwnProperty("timeline"));
        });



        var margin = {top: 200, right: 40, bottom: 40, left:40},
            width = 1200,
            height = 500;
        console.log(data[0]);
        console.log(data[0].fillingdate);
        console.log(data[data.length - 1].fillingdate);
        var x = d3.time.scale()
            .domain([new Date(data[0].fillingdate), d3.time.day.offset(new Date(data[data.length - 1].fillingdate), 1)])
            .rangeRound([0, (width - (margin.left + margin.right))]);

        var y = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.total; })])
            .range([height - margin.top - margin.bottom, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('top')
            .ticks(d3.time.months, 6)
            .tickFormat(function (d) { return ''; })
            .tickSize(0)
            .tickPadding(8);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .tickPadding(8);

        svg = d3.select('#chart').append('svg')
            .attr('class', 'chart')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

        svg.selectAll('.chart')
            .data(data)
            .enter().append('line')
            .on("click",function(ele){
                var rowToSelect = 0;
                var blnIsDataSelected = false;
                for(var intIndex=0; intIndex < $scope.myData.length; intIndex++){
                    if(parseInt($scope.myData[intIndex].id,10) == parseInt(ele.id,10)){
                        rowToSelect = intIndex;
                        break;
                    }
                }
                for(var intIndex=0; intIndex < $scope.selectedData.length; intIndex++){
                    if(parseInt($scope.selectedData[intIndex].id,10) == parseInt(ele.id,10)){
                        blnIsDataSelected = true;
                        break;
                    }
                }
                $scope.gridOptions.selectItem(rowToSelect, !blnIsDataSelected);
                var grid = $scope.gridOptions.ngGrid;
                grid.$viewport.scrollTop(grid.rowMap[rowToSelect] * grid.config.rowHeight);

                if(!$scope.$$phase)
                    $scope.$apply();
            })
            .attr('id',function(d){ return 'line_' + d.id})
            .attr('x1', function(d) { return x(new Date(d.fillingdate)); })
            .attr('y1', 10)
            .attr('x2', function(d) { return x(new Date(d.fillingdate)); })
            .attr('y2', function(d){
                if(d.hasOwnProperty('timeline') && d.hasOwnProperty('timeline') != "")
                    return 150;
                else
                    return -150;
            })
            .attr('class',function(d){
                if(d.hasOwnProperty('timeline') && d.hasOwnProperty('timeline') != "")
                    return "timeline-line";
                else
                    return "display-none other-line";
            })

        svg.selectAll('.label')
            .data(data)
            .enter().append('text')
            .attr('id',function(d){ return 'label_' + d.id})
            .attr('text-anchor','end')
            .attr('stroke',"#000000")
            .attr('class',function(d){
                if(d.hasOwnProperty('timeline') && d.hasOwnProperty('timeline') != "")
                    return "label-time";
                else
                    return "display-none other-label";
            }).attr('transform',function(d){
                if(d.hasOwnProperty('timeline') && d.hasOwnProperty('timeline') != "")
                    return 'translate(' + (x(new Date(d.fillingdate)) + 5) +',155) rotate(-90)';
                else
                    return 'translate(' + (x(new Date(d.fillingdate)) + 5) +',-155) rotate(-90)';
            })
            .text(function(d){ return d.fillingdate; })

        svg.selectAll('.caption')
            .data(data)
            .enter().append('text')
            .on("click",function(ele){
                var rowToSelect = 0;
                var blnIsDataSelected = false;
                for(var intIndex=0; intIndex < $scope.myData.length; intIndex++){
                    if(parseInt($scope.myData[intIndex].id,10) == parseInt(ele.id,10)){
                        rowToSelect = intIndex;
                        break;
                    }
                }
                for(var intIndex=0; intIndex < $scope.selectedData.length; intIndex++){
                    if(parseInt($scope.selectedData[intIndex].id,10) == parseInt(ele.id,10)){
                        blnIsDataSelected = true;
                        break;
                    }
                }
                $scope.gridOptions.selectItem(rowToSelect, !blnIsDataSelected);
                var grid = $scope.gridOptions.ngGrid;
                grid.$viewport.scrollTop(grid.rowMap[rowToSelect] * grid.config.rowHeight);

                if(!$scope.$$phase)
                    $scope.$apply();
            })
            .attr('id',function(d){ return 'caption_' + d.id})
            .attr('text-anchor',function(d){
                if(d.hasOwnProperty('timeline') && d.hasOwnProperty('timeline') != "")
                    return "end";
                else
                    return "start";
            })
            .attr('class',function(d){
                if(d.hasOwnProperty('timeline') && d.hasOwnProperty('timeline') != "")
                    return "caption-text caption-line";
                else
                    return "caption-text display-none other-caption";
            }).attr('transform',function(d){
                if(d.hasOwnProperty('timeline') && d.hasOwnProperty('timeline') != "")
                    return 'translate(' + (x(new Date(d.fillingdate)) + 15) +',15) rotate(-90)'
                else
                    return 'translate(' + (x(new Date(d.fillingdate)) + 15) +',-15) rotate(-90)'
            })
            .attr("title",function(d){ return d.type; })
            .text(function(d){
                if(d.type.length > 20)
                    return d.type.substr(0,20) + "...";
                return d.type;
            })

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, 10)')
            .call(xAxis);

    }
}