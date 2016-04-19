var margin = { top: 20, right: 50, bottom: 30, left: 50 },
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


var svg = d3.select("#plot").insert("svg", ":first-child")
    .attr("width", width + margin.left + margin.right + 10)
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

var carname = d3.select("#carname");


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
    // filter data with min/max
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

    // "enter" mode
    var circles = svg.selectAll(".dot")
        .data(data);

    circles.enter()
        .append("circle")
        .attr("class", "dot");

    circles.exit().remove();

    // "update" mode
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

    circles.on("mouseover", function(d) {
            d3.select(this)
                .transition()
                .duration(10)
                .attr("r", 8);
            carname.text("Name of selected car: " + d.name);
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(10)
                .attr("r", 5);
            carname.text("Name of selected car: ____");

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
    // add fig legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("circle")
        .attr("cx", width)
        .attr("r", 10)
        .attr("stroke", "black")
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 15)
        .attr("y", 0)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        });

}


var colNames = null;
var baseData = null;
var mpg_data = [];

var dataPath = "data/car.csv";
d3.csv(dataPath, function(csv) {
    colNames = d3.keys(csv[0]);
    csv.forEach(function(d) {
        mpg_data.push(d['mpg']);
        d.mpg = +d.mpg
        d.cylinders = +d.cylinders
        d.displacement = +d.displacement
        d.horsepower = +d.horsepower
        d.weight = +d.weight
        d.acceleration = +d.acceleration
        d["model.year"] = +d["model.year"]
    });
    baseData = csv;
    // Set div of webpage layout
    SetXAxisPlaceholder();
    SetYAxisPlaceholder();
    SetMpgRangePlaceholder();
    update("cylinders", "displacement");
});

function SetXAxisPlaceholder() {
    var ctlColNames = [];
    for (var i = 1; i < colNames.length - 1; i++) {
        ctlColNames.push(colNames[i])
    };
    var xChoice = d3.select("#xChoice");

    xChoice.append("b").text("Choose x-Axis: ");
    xChoice.append("select").attr("name", "xAX").attr("id", "xAXs");
    xChoice.select("select").selectAll("option")
        .data(ctlColNames)
        .enter()
        .append("option")
        .attr("value", function(d) {
            return d;
        })
        .text(function(d) {
            return d;
        });
}

function SetYAxisPlaceholder() {
    var ctlColNames = [];
    for (var i = 1; i < colNames.length - 1; i++) {
        ctlColNames.push(colNames[i])
    };
    var yChoice = d3.select("#yChoice");

    yChoice.append("b").text("Choose y-Axis: ");
    yChoice.append("select").attr("name", "yAX").attr("id", "yAXs");
    yChoice.select("select").selectAll("option")
        .data(ctlColNames)
        .enter()
        .append("option")
        .attr("value", function(d) {
            return d;
        })
        .text(function(d) {
            return d;
        });
}

function SetMpgRangePlaceholder() {
    // var mpg_data;
    var mpg_max = d3.max(mpg_data, function(d) {
        return +d;
    });
    var mpg_min = d3.min(mpg_data, function(d) {
        return +d;
    });
    var mpg_max2 = d3.round(mpg_max * 1.1);
    var mpg_min2 = d3.round(mpg_min * 0.9);

    var mpgchoice = d3.select("#mpgchoice");
    mpgchoice.append("p").append("b").text("Set filter based on MPG range: ");
    mpgchoice.append("span").append("label").attr("for", "mpg-min").text("Min = ");
    mpgchoice.append("span").append("input")
        .attr("id", "mpg-min")
        .attr("type", "number")
        .attr("value", mpg_min2)
        .attr("min", mpg_min2)
        .attr("max", mpg_max2)
        .attr("step", d3.round((mpg_max2 - mpg_min2) / mpg_data.length));
    mpgchoice.append("span").text(" ")
    mpgchoice.append("span").append("label").attr("for", "mpg-max").text("Max = ");
    mpgchoice.append("span").append("input")
        .attr("id", "mpg-max")
        .attr("type", "number")
        .attr("value", mpg_max2)
        .attr("min", mpg_min2)
        .attr("max", mpg_max2)
        .attr("step", d3.round((mpg_max2 - mpg_min2) / mpg_data.length));
    mpgchoice.append("span").text(" ")

}

d3.select("#run")
    .append("button")
    .attr("id", "update")
    .text("Click to Query!");

// Listen to event and update
d3.selectAll('select').on('change', function() {
    update();
});

d3.select('#update').on('click', function() {
    update();
})
