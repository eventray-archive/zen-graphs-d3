$(document).ready(function(e) { 
    var graph_types = [ 
          { name: 'bar-graph', proto: BarGraph }
        , { name: 'pie-graph', proto: PieGraph }
    ];
    var n_tests_per_graph_type = 10;
    var babble = ("cosby viral VHS bicycle ethical jean-shorts ennui cardigan beer semiotics mustache lo-fi authentic sustainable gluten-free DIY sriracha beard salvia dreamcatcher portland narwhal typewriter coffee gastropub single-origin thundercats mixtape lomo po-mo soho artisan localvore ironic quinoa skateboard vinyl retro iphone fixie").split(' ');

    var rand = function(limit) {
        return Math.round(Math.random() * (limit-1));
    }
    var randel = function(ary) {
        return ary[rand(ary.length)];
    }
     
    for(idx = 0; idx < graph_types.length; idx++) {
        var graph_type = graph_types[idx];
        for(j = 0; j < n_tests_per_graph_type; j++) {
            var n_values = rand(8)+2;
            var b_cast_as_percentage = false;
            if(graph_type.name == 'pie-graph') {
                b_cast_as_percentage = (rand(2) == 0);
            }

            var info = [];
            var options = {
                  title: randel(babble)
                , container: '#'+graph_type.name+j
                , height: 700
                , width: 500
                , value_format: b_cast_as_percentage ? '.1f %' : 'd'
                , b_cast_as_percentage: b_cast_as_percentage
                , figure_colors: [
                      colors.blue_dark
                    , colors.blue_dark_medium
                    , colors.blue_medium_dark
                    , colors.blue
                    , colors.blue_medium_light
                    , colors.blue_light_medium
                    , colors.blue_light
                ]
                , label_colors: [
                      colors.blue_dark
                    , colors.blue_dark_medium
                    , colors.blue_medium_dark
                    , colors.blue
                    , colors.blue_medium_light
                    , colors.blue_light_medium
                    , colors.blue_light
                ]
            };
            for(k = 0; k < n_values; k++) {
                info.push({ label: randel(babble), value: rand(100000) })
            }
            var graph_container = $('body').append("<div id="+graph_type.name+j+"></div>");
            var graph = new graph_type.proto(info, options);
        }
    }

});
