// Default settings
var colors = {
      blue_dark: '#062c54'
    , blue_dark_medium: '#183e65'
    , blue_medium_dark: '#194e7d'
    , blue: '#2c75a4'
    , blue_medium_light: '#49a7b4'
    , blue_light_medium: '#84cac9'
    , blue_light: '#b8dbca'
    , coffee_dark: '#ca9031'
    , coffee: '#d6a64b'
    , coffee_light: '#e6d06d'
};

// Some common transformation function generators
var multiplyBy = function(x) { 
    return function(y) {
        return x*y; 
    }
}

var divideBy = function(x) { 
    return function(y) {
        return y/x; 
    }
}

var add = function(x) { 
    return function(y) {
        return x+y; 
    }
}

var add = function(x, fn) { 
    return function(y) {
        return x+fn(y); 
    }
}

var subtract = function(x) { 
    return function(y) {
        return y-x; 
    }
}


var subtractFrom = function(x) {
    return function(y) {
        return x-y
    }
}

var subtractFrom = function(x, fn) { 
    return function(y) {
        return x-fn(y); 
    }
}

var loopThrough = function(ary) {
    return function(d, i) {
        return ary[i % ary.length];
    }
}

// Misc convenience classes
var RunningSum = function(scaleFn, data) {
    this.scaleFn = scaleFn;
    this.data = data;
}
RunningSum.prototype.calculate = function(i) { 
    var dataSum = d3.sum(this.data.slice(0, i));
    return this.scaleFn(dataSum);  
}

// Graph Convenience Classes

var Graph = function (info, options) {
    this.info = info ? info : this.info;
    this.options = options ? options : this.options;
    this.data = [];
    this.labels = [];


    if(options && $(options.container).length > 0) {

        for(i = 0; i < info.length; i++) {
            this.data.push(info[i].value);
            this.labels.push(info[i].label);
        }

        var options = this.options;
        var data = this.data;
        var padding = 18;
        var canvas = d3.select(options.container).selectAll('svg').data([0])
        canvas.enter().append('svg')
            .attr('height', options.height)
            .attr('width', options.width)
            ;
        canvas.exit().remove();
        var height = parseInt(canvas.style('height'));
        var width  = parseInt(canvas.style('width'));
        var graph_height = height - padding*2;
        var graph_width  = width  - padding*2;
        var graph = canvas.append('g');
        graph.attr('transform', 'translate('+padding+', '+padding+')');
        var graph = graph.append('g');
        graph.attr('transform', 'scale('+graph_width+'px, '+graph_height+'px)');

        this.render(graph, graph_height, graph_width);
    }
}

Graph.prototype.render = function() {
    console.log("I'm just an abstract graph, I don't know how to render myself.");
}

var BarGraph = function (info, options) {
    Graph.call(this, info, options);
}
BarGraph.prototype = new Graph(null, null);   
BarGraph.prototype.parent = Graph;
BarGraph.prototype.render = function (graph, height, width) {
    var data = this.data;
    var line_height = 18;
    var figure_height = height - 1.5*line_height;
    var y = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, figure_height]);
    var x = d3.scale.ordinal()
        .domain(data)
        .rangeBands([0, width]);

    var figures = graph.selectAll("rect.figure").data(data);
    figures.enter().append("rect")
        .attr("fill", loopThrough(this.options.figure_colors))
        ;
    figures
        .attr("x", add(line_height/2, x))
        .attr("width", x.rangeBand() - line_height)
        .attr("y", figure_height)
        .attr("height", 0)
        .transition().delay(500).duration(1000)
            .attr("height", y)
            .attr("y", subtractFrom(figure_height, y))
            .attr("class", "figure")
        ;
    figures.exit().remove();
    var numbers = graph.selectAll("text.number").data(data);
    numbers.enter().append("text")
        .attr("font-size", 18)
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        ;
    numbers
        .text(d3.format(this.options.value_format))
        .attr("x", add(x.rangeBand()/2, x))
        .attr("y", figure_height + line_height*1.5)
        .attr("class", "number")
        .transition().delay(500).duration(1000)
            .attr("y", subtractFrom(figure_height + line_height*1.5, y))
        ;
    numbers.exit().remove();
    var label_boxes = graph.selectAll("rect.label").data(this.labels);
    label_boxes.enter().append("rect")
        .attr("x", add(line_height/2, x))
        .attr("y", height - line_height*1.5)
        .attr("width", x.rangeBand() - line_height)
        .attr("height", line_height*1.5)
        .attr("class", "label")
        .attr("fill", loopThrough(this.options.label_colors))
        ;
    label_boxes.exit().remove();
    var labels = graph.selectAll("text.label").data(this.labels);
    labels.enter().append("text")
        .attr("x", add(x.rangeBand()/2, x))
        .attr("y", height-line_height/2)
        .attr("font-size", 18)
        .attr("fill", "white")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("class", "label")
        .text(String)
        ;
    labels.exit().remove();
}

var PieGraph = function (data, options) {
    Graph.call(this, data, options);
}
PieGraph.prototype.parent = Graph;
PieGraph.prototype = new Graph(null, null);   
PieGraph.prototype.render = function (graph, height, width) {
    var line_height = 18;
    var data = this.data.sort(function(a, b) { if(a > b) return 1; if(a < b) return -1; return 0; });
    var options = this.options;
    var sum = d3.sum(data);
    var cx = width/2 
    var cy = height/2.5;
    var r = (width > height ? height : width)/2.5;
    var radians = function(degrees) {
        return degrees*(Math.PI/180);
    }
    var degrees = function(radians) {
        return radians*(180/Math.PI);
    }
    var cos = function(angle) {
        return Math.cos(angle);
    }
    var sin = function(angle) {
        return Math.sin(angle);
    }
    var angle = d3.scale.linear()
        .domain([0, d3.sum(data)])
        .range([0, 2*Math.PI]);
    var angleRSum = new RunningSum(angle, data);
    
    var figures = graph.selectAll('path').data(data);
    figures.enter().append('path')
        .attr('d', function (d, i) {
            var angle1 = angleRSum.calculate(i);
            var angle2 = angleRSum.calculate(i+1);
            var angleMid = (angle1 + angle2)/2;
            var outset = Math.PI/(angle2 - angle1);
            var outsetX = cos(angleMid)*outset;
            var outsetY = sin(angleMid)*outset;
            var inset = outset/2;
            return sprintf (
                "M%(cx)d,%(cy)d L%(o1x)d,%(o1y)d A%(rx)d,%(ry)d 0 %(blong)d,1 %(o2x)d,%(o2y)d Z",
                {
                  cx: cx + outsetX
                , cy: cy + outsetY
                , o1x: cx + cos(angle1)*(r - inset) + outsetX
                , o1y: cy + sin(angle1)*(r - inset) + outsetY
                , o2x: cx + cos(angle2)*(r - inset) + outsetX
                , o2y: cy + sin(angle2)*(r - inset) + outsetY
                , rx: r
                , ry: r
                , blong: angle2 - angle1 > Math.PI ? 1 : 0
                }
            );
        })
        .attr('fill', loopThrough(this.options.figure_colors))
    figures.exit().remove();

    var bPutNumberOutside = function (angleDiff) {
        return angleDiff < radians(20);
    };
    var withNumberPositionInfo = function(i, fn) {
        var angle1 = angleRSum.calculate(i);
        var angle2 = angleRSum.calculate(i+1);
        var disp = r/2;
        return fn(angle1, angle2, disp);
    };
    var withNumberPosition = function(fn) {
        return function(d, i) {
            return withNumberPositionInfo(i, function(angle1, angle2, disp) {
                var angle = angle_adjusted = (angle1 + angle2)/2;
                var disp_adjusted = disp;
                var angle_diff = angle2 - angle1;
                if(bPutNumberOutside(angle_diff)) {
                    disp_adjusted = r + 36;
                    // angle_adjusted = angle2 + radians(30) - angle_diff; 
                    angle_adjusted = i*radians(15) + radians(30);
                }
                return fn(angle, disp, angle_adjusted, disp_adjusted);
            });
        };
    };
    var forNumberPosition = function(hash) {
        return function(d, i) {
            return withNumberPositionInfo(i, function(angle1, angle2, disp) {
                    if(bPutNumberOutside(angle2 - angle1)) {
                        return hash.outside;
                    } else {
                        return hash.inside;
                    }
                }
            );
        }
    };
    var numbers = graph.selectAll('text.number').data(data);
    numbers.enter().append('text')
        .text(function(d, i) { 
            if(options.b_cast_as_percentage) {
                return ""+d3.format(options.value_format)(d/sum*100)+"%"
            } else {
                return d3.format(options.value_format)(d);
            }
        })
        .attr('x', withNumberPosition (function (angle_raw, disp_raw, angle, disp) {
            return cx + cos(angle)*disp; 
        }))
        .attr('y', withNumberPosition (function (angle_raw, disp_raw, angle, disp) {
            return cy + sin(angle)*disp; 
        }))
        .attr('fill', forNumberPosition({inside: 'white', outside: 'black'}))
        .attr("font-size", 18)
        .attr("font-weight", forNumberPosition({inside: 'bold', outside: 'normal'}))
        .attr("text-anchor", "middle")
        .attr("class", "number")
        ; 
    numbers.exit().remove();

    var number_pointers = graph.selectAll('line.pointer').data(data);
    number_pointers.enter().append('line')
        .attr('x1', withNumberPosition (function(angle, disp, angle_adj, disp_adj) {
            return cx + cos(angle)*disp;
        }))
        .attr('y1', withNumberPosition (function(angle, disp, angle_adj, disp_adj) {
            return cy + sin(angle)*disp;
        }))
        .attr('x2', withNumberPosition (function(angle, disp, angle_adj, disp_adj) {
            return cx + cos(angle_adj)*disp_adj - (cos(angle_adj)*disp_adj - cos(angle)*disp)*0.14;
        }))
        .attr('y2', withNumberPosition (function(angle, disp, angle_adj, disp_adj) {
            return cy + sin(angle_adj)*disp_adj - (sin(angle_adj)*disp_adj - sin(angle)*disp)*0.14;
        }))
        .attr('stroke', forNumberPosition({
            inside: 'none', 
            outside: 'black'
        }))
        .attr('stroke-width', forNumberPosition({
            inside: 0,
            outside: 1
        }))
        .attr('stroke-opacity', 0.5)
        .attr("class", "pointer")
        ;

    var bPutLabelOutside = function (angleDiff) {
        return angleDiff < radians(60);
    };
    var forLabelPosition = function(i, hash) {
        return withNumberPositionInfo(i, function(angle1, angle2, disp) {
                if(bPutLabelOutside(angle2 - angle1)) {
                    return hash.outside;
                } else {
                    return hash.inside;
                }
            }
        );
    };

    var figure_keys = graph.selectAll("circle.figure_key").data(this.labels);
    figure_keys.enter().append("circle")
        .attr("cx", function(d, i) { return (i % 2)*width/2 + line_height; } )
        .attr("cy", function(d, i) { return cy + r + line_height + Math.round(i/2)*2.5*line_height; } )
        .attr("r", line_height)
        .attr("class", "figure_key")
        .attr("fill", function(d, i){ 
            return withNumberPositionInfo(i, function(angle1, angle2, disp) { 
                if(bPutLabelOutside(angle2 - angle1)) {
                    return loopThrough(options.figure_colors)(d, i);
                } else {
                    return 'none';
                }
            })
        })
        ;
    figure_keys.exit().remove();
    var labels = graph.selectAll("text.label").data(this.labels);
    labels.enter().append("text")
        .attr("x", function(d, i){
            return withNumberPositionInfo(i, function(angle1, angle2, disp) { 
                if(bPutLabelOutside(angle2 - angle1)) { 
                    return (i % 2)*width/2 + line_height*2.5;
                } else {
                    return cx + cos((angle1+angle2)/2)*disp; 
                }
            })
        })
        .attr("y", function(d, i) { 
            return withNumberPositionInfo(i, function (angle1, angle2, disp) {
                if(bPutLabelOutside(angle2 - angle1)) {
                    return cy + r + line_height +  Math.round(i/2)*2.5*line_height; 
                } else {
                    return cy + sin((angle1+angle2)/2)*disp + line_height; 
                }
        })})
        .attr('fill', function(d, i) {
            return withNumberPositionInfo(i, function (angle1, angle2, disp) {
                if(bPutLabelOutside(angle2 - angle1)) {
                    return loopThrough(options.figure_colors)(d, i);
                } else {
                    return 'white';
                }
         })})
        .attr("font-size", 18)
        .attr("text-anchor", function(d, i) {
            return withNumberPositionInfo(i, function (angle1, angle2, disp) {
                if(bPutLabelOutside(angle2 - angle1)) {
                    return 'left';
                } else {
                    return 'middle';
                }
         })})
        .attr("class", "label")
        .text(function (d, i) { 
            return withNumberPositionInfo(i, function (angle1, angle2, disp) {
                if(bPutLabelOutside(angle2 - angle1)) {
                    var number = d3.format(options.value_format)(data[i]);
 
                    if(options.b_cast_as_percentage) {
                        number = ""+d3.format(options.value_format)((data[i]/sum)*100)+"%"
                    }
                    return "" + d + " " + number;
                } else {
                    return d;
                }
            })})
        ;
    labels.exit().remove();
    graph.append("text")
        .attr("x", width/2)
        .attr("y", height)
        .attr('fill', 'black')
        .attr("font-size", 18)
        .attr("text-anchor", 'middle')
        .attr("class", "label")
        .text("total "+String(sum))
        ;

}



