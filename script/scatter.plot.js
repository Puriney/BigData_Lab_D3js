var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);


var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(5)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(5)
    .orient("left");

var name = d3.select("body").append("h4", ":first-child")
    .attr("id", "dotName")
    .text('Car Name')


var svg = d3.select("body").insert("svg", ":first-child")
    .attr("width", width + margin.left + 2 * margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xg = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");
xg
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end");

var yg = svg.append("g")
    .attr("class", "y axis");
yg
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");

var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
    });

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
        return d;
    });

var figLegendRectSize = 18;
var figLegendSpacing = 4;


function update() {
    // select axis
    var xVar = d3.select('#xAXs').node().value,
        yVar = d3.select('#yAXs').node().value;
    // select car origin
    var checks = {};
    d3.selectAll('input[type=checkbox]').each(function() {
        checks[this.value] = this.checked;
    });
    var data = baseData.filter(function(d, i) {
        d.x = d[xVar];
        d.y = d[yVar];
        return checks[d.origin];
    });
    // select min/max values
    var selectMin = d3.select('#mpg-min').node().value,
        selectMax = d3.select('#mpg-max').node().value;
    // redraw svg with min/max
    data = data.filter(function(d) {
        return d['mpg'] >= selectMin
    });
    data = data.filter(function(d) {
        return d['mpg'] <= selectMax
    });

    // set domains
    x.domain(d3.extent(data, function(d) {
        return d.x;
    })).nice();
    y.domain(d3.extent(data, function(d) {
        return d.y;
    })).nice();

    xg.call(xAxis);
    yg.call(yAxis);

    xg.select("text").text(xVar);
    yg.select("text").text(yVar);

    // on enter
    var circles = svg.selectAll(".dot")
        .data(data);

    circles.enter()
        .append("circle")
        .attr("class", "dot");

    circles.exit().remove();

    // on update
    circles.attr("cx", function(d) {
            return x(d.x);
        })
        .attr("cy", function(d) {
            return y(d.y);
        })
        .style("fill", function(d) {
            return color(d.origin);
        })
        .attr("r", 5);

    circles.on("mouseover", function() {
            d3.select(this)
                .transition()
                .duration(10)
                .attr("r", 8)
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(10)
                .attr("r", 5)
        })
        .append("title")
        .text(function(d) {
            return d.name +
                "\n mpg: " + d["mpg"] +
                "\n cylinders: " + d["cylinders"] +
                "\n displacement: " + d["displacement"] +
                "\n horsepower: " + d["horsepower"] +
                "\n weight: " + d["weight"] +
                "\n acceleration: " + d["acceleration"] +
                "\n model year: " + d["model.year"]
        });

    // add figure legend

    // var figlegend = svg.selectAll(".figlegend")
    //     .data(color.domain())
    //     .enter()
    //     .append("g")
    //     .attr("class", "legend")
    //     .attr("transform", function(d, i) {
    //         var height = figLegendRectSize + figLegendSpacing;
    //         var offset = height * color.domain().length / 2;
    //         var horz = width - 2 * margin.right;
    //         var vert = i * height + 1 * offset;
    //         return 'translate(' + horz + ',' + vert + ')';
    //     });

    // figlegend.append("circle")
    //     .attr("class", "dot")
    //     .attr("r", 8)
    //     .style("fill", color)
    //     .style("stroke", "black");

    // figlegend.append("text")
    //     .attr("x", figLegendRectSize + figLegendSpacing)
    //     .attr("y", figLegendRectSize - figLegendSpacing)
    //     .text(function(d) {
    //         return d;
    //     });

}

var baseData = null;
var dataPath = "data/car.csv";
d3.csv(dataPath, function(error, csv) {
    csv.forEach(function(d) {
        d.mpg = +d.mpg
        d.cylinders = +d.cylinders
        d.displacement = +d.displacement
        d.horsepower = +d.horsepower
        d.weight = +d.weight
        d.acceleration = +d.acceleration
        d["model.year"] = +d["model.year"]
    });
    baseData = csv;
    update("cylinders", "displacement");
});

d3.selectAll('select').on('change', function() {
    update();
});

// d3.selectAll('input').on('click', function() {
//     update();
// })

d3.select('#update').on('click', function() {
    update();
})
