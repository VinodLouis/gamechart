/**
 * Created by wa on 27/9/14.
 */

var intMainSvgHeight = 1500;
var intMainSvgWidth = 1000;
var intBetweenLinestart = 270;

var intXCenterMain = intMainSvgWidth/2;
var duration   = 500,
    transition = 200;
var initialWidth=200,initialHeight=200;
var percentage=[];
var color=d3.scale.category20();
var chart_no=[1,2,3];
var message=[];
var arrpos = [] ;

var data=[
    {total:2663,patents:1811,header:'HIGH-TECH LAWSUITS',content:'of patents lawsuits were High-Tech related'},
    {total:1605,patents:289,header:'FILED AGAINST SMEs',content:'of High-Tech cases were filed against SMEs by NPEs',addContent:'NPE WHO FILED MOST HIGH-TECH CASES AGAINST SMEs THIS MONTH',innerData:[{header:'eDekka LLC',content:'19 cases, 1 patent'},{header:'Uniloc USA',content:'18 cases, 1 patent'}]},
    {total:1804,patents:1534,header:'FILED by NPEs',content:'of High-Tech lawsuits were filed by NPEs',addContent:'NPE WHO FILED MOST HIGH-TECH CASES THIS MONTH',innerData:[{header:'eDekka LLC',content:'130 cases, 1 patent'},{header:'Olivistar LLC',content:'61 cases, 3 patents'},{header:'Penovia LLC',content:'49 cases, 1 patent'}]},

];

var svg;

function fnDrawChart(){
    body = d3.select('body');

    svg = body.append('svg')
        .attr('id',"mainSvg")
        .attr('height', intMainSvgHeight)
        .attr('width', intMainSvgWidth)
        .style('display','block')
        .style('margin','auto')
        .attr('border','1');

    svg.append("svg:image")
        .attr("xlink:href", "image/logo.png")
        .attr("x", intXCenterMain - 228)
        .attr("y", 0)
        .attr("width", 457)
        .attr("height", 280)
    /*
    svg.append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("height",intMainSvgHeight)
        .attr("width",intMainSvgWidth)
        .attr("stroke","#000000")
        .attr("fill","none");
    */



    var lineBetween = svg.append('g');

// Define the gradient
    var gradient = lineBetween.append("svg:defs")
        .append("svg:radialGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

// Define the gradient colors
    gradient.append("svg:stop")
        .attr("offset", "90%")
        .attr("stop-color", "#FFFFFF")
        .attr("stop-opacity", 1);

    gradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", "#E8E8E8")
        .attr("stop-opacity", 1);

    lineBetween.append("circle")
        .attr("cx",intXCenterMain)
        .attr("cy",intBetweenLinestart+850)
        .attr("r",175)
        .attr("fill","url(#gradient)");

    lineBetween.append("rect")
        .attr("x",intXCenterMain - 5)
        .attr("y",intBetweenLinestart)
        .attr("fill","#F68E36")
        .attr("width",10)
        .attr("height",0)
        .transition()
        .duration(2000)
        .attr("height",850)
        .each("end", function(){

            lineBetween.append("svg:image")
                .attr("xlink:href", "image/home.png")
                .attr("x", intXCenterMain - 140)
                .attr("y", intBetweenLinestart+750)
                .attr("width", 100)
                .attr("height", 100)


            lineBetween.append('foreignObject')
                .attr('x', intXCenterMain + 30)
                .attr('y', intBetweenLinestart+770)
                .attr('width', 130)
                .attr('height',250)
                .append("xhtml:body")
                .html('<div class="final-patent">2671</div><div class="text-content text-center">Total Patent Lawsuits filed in US District Court in Past Six Months</div>')


            lineBetween.append("circle")
                .attr("cx",intXCenterMain)
                .attr("cy",intBetweenLinestart+850)
                .attr("r",30)
                .attr("fill","#F68E36");

            drawDonutChart(
                intXCenterMain - 500,
                intBetweenLinestart+100,
                fnPrepareDataForPercentage(0,0," of patent lawsuits were High-Tech related "),
                initialWidth,
                initialHeight,
                ".35em",
                chart_no[0]
            );

            drawDonutChart(
                intXCenterMain - 500,
                intBetweenLinestart+400,
                fnPrepareDataForPercentage(1,1," of  High-Tech lawsuits are filed by NPEs "),
                initialWidth,
                initialHeight,
                ".35em",
                chart_no[1]
            );

            drawDonutChart(
                intXCenterMain + 295,
                intBetweenLinestart+250,
                fnPrepareDataForPercentage(2,2," of High-Tech cases were filed against SMEs by NPEs "),
                initialWidth,
                initialHeight,
                ".35em",
                chart_no[2]
            );
            fnPrune()
        });




    var leftChart = svg.append('g');
    var arrCordinates = [intXCenterMain-290,intBetweenLinestart+140,intXCenterMain-50,intBetweenLinestart+140,intXCenterMain-20,intBetweenLinestart+200,intXCenterMain-290,intBetweenLinestart+200];
    leftChart.append('polygon')
        .attr("points",arrCordinates.join(","))
        .attr("stroke","#395FAC")
        .attr("fill","#395FAC");

    leftChart.append('foreignObject')
        .attr('x', intXCenterMain-290)
        .attr('y', intBetweenLinestart+140)
        .attr('width', 240)
        .attr('height', 60)
        .append("xhtml:body")
        .html('<div class="chart-text-main">' + data[0].header + '</div><div class="chart-text-main">' + parseInt((data[0].patents/data[0].total)*100,10) + '% (' + data[0].patents + ')</div>')

    arrCordinates = [intXCenterMain-290,intBetweenLinestart+260,intXCenterMain-50,intBetweenLinestart+260,intXCenterMain-20,intBetweenLinestart+200,intXCenterMain-290,intBetweenLinestart+200];
    leftChart.append('polygon')
        .attr("points",arrCordinates.join(","))
        .attr("stroke","#394FA2")
        .attr("fill","#394FA2");

    leftChart.append('foreignObject')
        .attr('x', intXCenterMain-290)
        .attr('y', intBetweenLinestart+200)
        .attr('width', 240)
        .attr('height', 60)
        .append("xhtml:body")
        .html('<div class="chart-text-main">' + data[0].content + '</div>')


    arrCordinates = [intXCenterMain-290,intBetweenLinestart+410,intXCenterMain-50,intBetweenLinestart+410,intXCenterMain-20,intBetweenLinestart+470,intXCenterMain-290,intBetweenLinestart+470];
    leftChart.append('polygon')
        .attr("points",arrCordinates.join(','))
        .attr("stroke","#F15D5D")
        .attr("fill","#F15D5D");

    leftChart.append('foreignObject')
        .attr('x', intXCenterMain-290)
        .attr('y', intBetweenLinestart+410)
        .attr('width', 240)
        .attr('height', 60)
        .append("xhtml:body")
        .html('<div class="chart-text-main">' + data[1].header + '</div><div class="chart-text-main">' + parseInt((data[1].patents/data[1].total)*100,10) + '% (' + data[1].patents +') </div>')

    arrCordinates = [intXCenterMain-290,intBetweenLinestart+470,intXCenterMain-20,intBetweenLinestart+470,intXCenterMain-50,intBetweenLinestart+530,intXCenterMain-290,intBetweenLinestart+530];
    leftChart.append('polygon')
        .attr("points",arrCordinates.join(','))
        .attr("stroke","#EE3535")
        .attr("fill","#EE3535");

    leftChart.append('foreignObject')
        .attr('x', intXCenterMain-290)
        .attr('y', intBetweenLinestart+470)
        .attr('width', 240)
        .attr('height', 60)
        .append("xhtml:body")
        .html('<div class="chart-text-main">' + data[1].content + '</div>')


    leftChart.append("rect")
        .attr("x",intXCenterMain-300)
        .attr("y",intBetweenLinestart+550)
        .attr("height",80)
        .attr("width",280)
        .attr("rx",10)
        .attr("rx",10)
        .attr("fill","#F15D5D")
        .attr("stroke","#F15D5D")

    leftChart.append('foreignObject')
        .attr('x', intXCenterMain-300)
        .attr('y', intBetweenLinestart+550)
        .attr('width', 280)
        .attr('height', 80)
        .append("xhtml:body")
        .html('<div class="chart-text-main">' + data[1].addContent + '</div>')

    leftChart.append('foreignObject')
        .attr('x', intXCenterMain-300)
        .attr('y', intBetweenLinestart+635)
        .attr('width', 300)
        .attr('height', 300)
        .append("xhtml:body")
        .html(fnGetAdditionalStrings(data[1].innerData,'red'));

    var rightChart = svg.append('g');

    arrCordinates = [intXCenterMain+20,intBetweenLinestart+335,intXCenterMain+50,intBetweenLinestart+275,intXCenterMain+290,intBetweenLinestart+275,intXCenterMain+290,intBetweenLinestart+335];
    rightChart.append('polygon')
        .attr("points",arrCordinates.join(","))
        .attr("stroke","#F5A533")
        .attr("fill","#F5A533");

    rightChart.append('foreignObject')
        .attr('x', intXCenterMain+50)
        .attr('y', intBetweenLinestart+275)
        .attr('width', 240)
        .attr('height', 60)
        .append("xhtml:body")
        .html('<div class="chart-text-main">' + data[2].header + '</div><div class="chart-text-main">' + parseInt((data[2].patents/data[2].total)*100,10)+ '% (' + data[2].patents + ') </div>')

    arrCordinates = [intXCenterMain+20,intBetweenLinestart+335,intXCenterMain+290,intBetweenLinestart+335,intXCenterMain+290,intBetweenLinestart+395,intXCenterMain+50,intBetweenLinestart+395];
    rightChart.append('polygon')
        .attr("points",arrCordinates.join(','))
        .attr("stroke","#F28F00")
        .attr("fill","#F28F00");

    rightChart.append('foreignObject')
        .attr('x', intXCenterMain+50)
        .attr('y', intBetweenLinestart+335)
        .attr('width', 240)
        .attr('height', 60)
        .append("xhtml:body")
        .html('<div class="chart-text-main">' + data[2].content + '</div>')

    rightChart.append("rect")
        .attr("x",intXCenterMain+50)
        .attr("y",intBetweenLinestart+415)
        .attr("height",80)
        .attr("width",250)
        .attr("rx",10)
        .attr("rx",10)
        .attr("fill","#F68E36")
        .attr("stroke","#F68E36")

    rightChart.append('foreignObject')
        .attr('x', intXCenterMain+50)
        .attr('y', intBetweenLinestart+425)
        .attr('width', 250)
        .attr('height', 75)
        .append("xhtml:body")
        .html('<div class="chart-text-main">' + data[2].addContent + '</div>')

    rightChart.append('foreignObject')
        .attr('x', intXCenterMain+40)
        .attr('y', intBetweenLinestart+500)
        .attr('width', 300)
        .attr('height', 300)
        .append("xhtml:body")
        .html(fnGetAdditionalStrings(data[2].innerData,'yellow'))
}

function fnGetAdditionalStrings(data,color){
    var strHTML = "";
    if(color == 'red'){
        for(var intIndex=0;intIndex<data.length;intIndex++){
            strHTML += '<div class="text-head-red">' + data[intIndex].header + '</div>';
            strHTML += '<div class="text-content">' + data[intIndex].content + '</div>';
        }
    }else if(color == 'yellow'){
        for(var intIndex=0;intIndex<data.length;intIndex++){
            strHTML += '<div class="text-head">' + data[intIndex].header + '</div>';
            strHTML += '<div class="text-content">' + data[intIndex].content + '</div>';
        }
    }
    return strHTML;
}

function fnPrepareDataForPercentage(t,p,msg){
    percentage[t]=parseInt((data[p].patents*100)/data[t].total);
    message[t]="% ("+data[p].patents+") "+msg;
    return percentage[t];
}

function drawDonutChart(x,y, percent, width, height, text_y,chart_no) {
    width = typeof width !== 'undefined' ? width : 500;
    height = typeof height !== 'undefined' ? height : 500;
    text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";

    var dataset = {
            lower: calcPercent(0),
            upper: calcPercent(percent)
        },
        radius = Math.min(width, height) / 2,
        pie = d3.layout.pie().sort(null),
        format = d3.format(".0%");

    var arc = d3.svg.arc()
        .innerRadius(radius *0.6)
        .outerRadius(radius*1.0);

    var overLapArc=d3.svg.arc()
        .innerRadius(radius*0.6)
        .outerRadius(radius*0.72)
        .startAngle(0)
        .endAngle(360);


    var svg = d3.select("#mainSvg").append("svg")
        .attr('x',x)
        .attr('y',y)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width/2 + "," + height / 2 + ")");

    svg.append("path")
        .attr("class","innerRing_"+chart_no)
        .attr("d",overLapArc)
        .attr("transform","translate("+width+","+height-200+")");

    var path = svg.selectAll(".abc")
        .data(pie(dataset.lower))
        .enter().append("path")
        .attr("class", function(d, i) { arrpos.push(arc.centroid(d));  return "abc color" + i+"_"+chart_no })
        .attr("d", arc)
        .each(function(d) { this._current = d; }); // store the initial values


    svg.append("g")
        .data(pie(dataset.upper))
        .attr("transform",function(d,i){ return "translate(" + arc.centroid(d) + ")"})
        .append("text")
        .attr("class","centerText")
        .attr("stroke","white")
        .attr("text-anchor","middle")
        .style("fill","white")
        .attr("dy", text_y)
        .text(data[chart_no-1].patents);

    var text = svg.append("text")
        .attr("class","textPercentage")
        .attr("text-anchor", "middle")
        .attr("dy", text_y);


    if (typeof(percent) === "string") {
        text.text(percent);
    }
    else {
        var progress = 0;
        var timeout = setTimeout(function () {
            clearTimeout(timeout);
            path = path.data(pie(dataset.upper)); // update the data
            path.transition().duration(duration).attrTween("d", function (a) {
                // Store the displayed angles in _current.
                // Then, interpolate from _current to the new angles.
                // During the transition, _current is updated in-place by d3.interpolate.
                var i  = d3.interpolate(this._current, a);
                var i2 = d3.interpolate(progress, percent)
                this._current = i(0);
                return function(t) {
                    text.text( format(i2(t) / 100) );
                    return arc(i(t));
                };
            }); // redraw the arcs
        }, 200);
    }
};

function calcPercent(percent) {
    return [percent, 100-percent];
};
function fnPrune(){

    $(".color1_1").remove();
    $(".color1_2").remove();
    $(".color1_3").remove();

    $(".textPercentage").css("font-size",initialWidth*0.25);
    $(".centerText").css("font-size",initialWidth*0.070);

    $('.color0_1').tipsy({
        gravity: 'w',
        html: true,
        title: function() {
            return parseInt(percentage[0])+message[0];
        }
    });

    $('.color0_2').tipsy({
        gravity: 'w',
        html: true,
        title: function() {
            return parseInt(percentage[1])+message[1];
        }
    });

    $('.color0_3').tipsy({
        gravity: 'w',
        html: true,
        title: function() {
            return parseInt(percentage[2])+message[2];
        }
    });

}