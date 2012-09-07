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
        console.log('i='+idx);
        console.log(graph_type.name);
        for(j = 0; j < n_tests_per_graph_type; j++) {
            var n_values = rand(10);
            var info = [];
            var options = {
                  title: randel(babble)
                , container: '#'+graph_type.name+j
                , height: 800
                , width: 600 
                , value_format: 'd'
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

    // var barGraph = new BarGraph(
    //       [ 
    //           { label: '8/01', value: 20 }
    //         , { label: '8/08', value: 33 }
    //         , { label: '8/15', value: 15 }
    //         , { label: '8/22', value: 36 }
    //       ]
    //     , {
    //           title: 'Registrations By Week'
    //         , title_format: ''
    //         , container: '#test-graph1-container'
    //         , height: 400
    //         , width: '100%'
    //         , value_format: 'd'
    //         , figure_colors: [
    //             colors.blue
    //         ]
    //         , label_colors: [
    //             colors.blue_dark
    //         ]
    //       }
    // );
    // var pieGraph = new PieGraph(
    //     [ 
    //           { label: 'online',         value: 0.74 } 
    //         , { label: 'in-person',      value: 0.20 } 
    //         , { label: 'paper airplane', value: 0.03 } 
    //         , { label: 'telepathy',      value: 0.02 } 
    //         , { label: 'accident',       value: 0.01 }
    //     ],
    //     {
    //           title: 'Registrations By Type'
    //         , title_format: ''
    //         , container: '#test-graph2-container'
    //         , height: 600
    //         , width: '100%'
    //         , value_format: '%d'
    //         , figure_colors: [
    //               colors.blue_medium_light
    //             , colors.blue_light_medium
    //             , colors.blue
    //             , colors.blue_medium_dark
    //             , colors.blue_dark
    //         ]
    //     }
    // );
});
