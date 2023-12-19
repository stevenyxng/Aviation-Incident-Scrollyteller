var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.
  var width = 600;
  var height = 520;
  var margin = { top: 0, left: 20, bottom: 40, right: 10 };

  // document.querySelector('html').style.filter = 'invert(100%)'

  var lastIndex = -1;
  var activeIndex = 0;

  // Sizing for the grid visualization
  var squareSize = 6;
  var squarePad = 2;
  var numPerRow = width / (squareSize + squarePad);

  // main svg used for visualization
  var svg = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;

  var countryBarsXScale = d3.scaleBand()
    .paddingInner(0.08)
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    .range([25, width], 0.1, 0.1);

  var countryBarYScale = d3.scaleLinear()
    .domain([0, 1200])
    .range([height - 50, 0]);

  const XAxisCountries = [
    'U.S.',
    'U.K.',
    'Japan',
    'Indonesia',
    'France',
    'Australia',
    'Brazil',
    'Germany',
    'Canada',
    'China'];

  var countriesXAxis = d3.axisBottom(countryBarsXScale)
    .tickFormat(function(d, i) {
      return XAxisCountries[i];
    });

  var countriesYAxis = d3.axisLeft(countryBarYScale);

  var carrierBarsXScale = d3.scaleBand()
    .paddingInner(0.08)
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    .range([25, width], 0.1, 0.1);

  var carrierBarYScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height - 50, 0]);

  const XAxisCarriers = [
    'Delta',
    'American',
    'United',
    'Southwest',
    'Continental',
    'U.S. Airways',
    'Northwest',
    'FedEx',
    'America West',
    'Alaskan'];
  
  var carriersXAxis = d3.axisBottom(carrierBarsXScale)
    .tickFormat(function(d, i) {
      return XAxisCarriers[i];
    });

  var carriersYAxis = d3.axisLeft(carrierBarYScale);

  var makeBarXScale = d3.scaleBand()
    .paddingInner(0.08)
    .domain([0, 1, 2, 3, 4])
    .range([25, width], 0.1, 0.1);

  var makeBarYScale = d3.scaleLinear()
    .domain([0, 1300])
    .range([height - 50, 0]);
  
  const XAxisMakes = [
    'Boeing',
    'McDonell-Douglas',
    'Airbus',
    'Embraer',
    'Bombardier'];
  
  var makesXAxis = d3.axisBottom(makeBarXScale)
    .ticks(XAxisMakes.length)
    .tickFormat(function(d, i) {
      return XAxisMakes[i];
    });

  var makesYAxis = d3.axisLeft(makeBarYScale);
  
  var phaseBarXScale = d3.scaleBand()
    .paddingInner(0.08)
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .range([25, width], 0.1, 0.1);

  var phaseBarYScale = d3.scaleLinear()
    .domain([0, 200])
    .range([height - 50, 0]);
  
  const XAxisPhase = [
    'Takeoff',
    'Taxi',
    'Landing',
    'Cruise',
    'Standing',
    'Descent',
    'Approach',
    'Climb',
    'Go-Around',
    'Other',
    'Maneuvering'];
  
  var phaseXAxis = d3.axisBottom(phaseBarXScale)
    .ticks(XAxisPhase.length)
    .tickFormat(function(d, i) {
      return XAxisPhase[i];
    });

  var phaseYAxis = d3.axisLeft(phaseBarYScale);

  // Color is determined just by the index of the countrycountryBars
  var barColors = {
    0: '#336699', // Dusty blue
    1: '#cc9966', // Earthy orange
    2: '#669966', // Mossy green
    3: '#996666', // Brownish red
    4: '#996699', // Dusky purple
    5: '#cc9999', // Greige
    6: '#66cc66', // Olive green
    7: '#666699', // Slate blue
    8: '#cc8866', // Taupe
    9: '#9966cc', // Mauve
    10: '#9999CC', // Dusty lavender
    11: '#66CC99', // Muted blue-green seafoam
  };

  var activateFunctions = [];
  var updateFunctions = [];

  var chart = function (selection) {
    selection.each(function (rawData) {
      // create svg and give it a width and height
      svg = d3.select(this).selectAll('svg').data([accidentData]);
      var svgE = svg.enter().append('svg');
      // @v4 use merge to combine enter and existing selection
      svg = svg.merge(svgE);

      svg.attr('width', width + margin.left + margin.right);
      svg.attr('height', height + margin.top + margin.bottom);

      svg.append('g');


      // this group element will be used to contain all
      // other elements.
      g = svg.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // perform some preprocessing on raw data
      var accidentData = getAccidents(rawData);
      // filter to just include filler words
      var fatalAccidents = getFatalAccidents(accidentData);
      var nonFatalAccidents = getNonFatalAccidents(accidentData);

      // get the counts of filler words for the
      // bar chart display
      var countryCounts = groupByCountry(accidentData).slice(0, 10);
      console.log(countryCounts);

      var makeCounts = groupByMake(accidentData).slice(0, 5);
      console.log(makeCounts);

      var phaseCounts = groupByPhase(accidentData).slice(1, 12);
      console.log(phaseCounts);

      var deltaAccidents = getCarrierArray(accidentData, "delta");
      var americanAccidents = getCarrierArray(accidentData, "american");
      var unitedAccidents = getCarrierArray(accidentData, "united");
      var southwestAccidents = getCarrierArray(accidentData, "southwest");
      var continentalAccidents = getCarrierArray(accidentData, "continental");
      var usAirwaysAccidents = getCarrierArray(accidentData, "us airways", "u.s. airways");
      var northwestAccidents = getCarrierArray(accidentData, "northwest");
      var fedexAccidents = getCarrierArray(accidentData, "fedex", "federal express");
      var americawestAccidents = getCarrierArray(accidentData, "america west");
      var alaskaAccidents = getCarrierArray(accidentData, "alaska");

      var carriersArray = [
        {carrier: 'Delta', count: deltaAccidents.length}, 
        {carrier: 'American', count: americanAccidents.length}, 
        {carrier: 'United', count: unitedAccidents.length}, 
        {carrier: 'Southwest', count: southwestAccidents.length}, 
        {carrier: 'Continental', count: continentalAccidents.length}, 
        {carrier: 'US Airways', count: usAirwaysAccidents.length}, 
        {carrier: 'Northwest', count: northwestAccidents.length}, 
        {carrier: 'Fedex', count: fedexAccidents.length}, 
        {carrier: 'America West', count: americawestAccidents.length}, 
        {carrier: 'Alaska', count: alaskaAccidents.length}
      ];
      
      var groupByCarrier = d3.nest()
        .key(function(d) { return d.carrier; })
        .rollup(function(v) { return v[0].count })
        .entries(carriersArray);
      
      // var carrierCounts = groupByCarrier(accidentData);
      // console.log(carrierCounts);
      // set the bar scale's domain
      var countMax = d3.max(countryCounts, function (d) { return d.value;});

      setupVis(accidentData, countryCounts, groupByCarrier, makeCounts, phaseCounts);

      setupSections();
    });
  };

  var setupVis = function (accidentData, countryCounts, groupByCarrier, makeCounts, phaseCounts) {
    // axis
    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
    g.select('.x.axis').style('opacity', 0);

    g.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(25, 50)')
    g.select('.y.axis').style('opacity', 0);

    // count openvis title
    g.append('text')
      .attr('class', 'title openvis-title highlight')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text('1,987');

    g.append('text')
      .attr('class', 'sub-title openvis-title')
      .attr('x', width / 2)
      .attr('y', (height / 3) + (height / 5))
      .text('incidents');

    g.selectAll('.openvis-title')
      .attr('opacity', 0);

    // count filler word count title
    g.append('text')
      .attr('class', 'title count-title highlight')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text('0.001%');

    g.append('text')
      .attr('class', 'sub-title count-title')
      .attr('x', width / 2)
      .attr('y', (height / 3) + (height / 5))
      .text('of flights');

    g.selectAll('.count-title')
      .attr('opacity', 0);

    // square grid
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
    var squares = g.selectAll('.square').data(accidentData, function (d) { return d.Accident_Number; });
    var squaresE = squares.enter()
      .append('rect')
      .classed('square', true);
    squares = squares.merge(squaresE)
      .attr('width', squareSize)
      .attr('height', squareSize)
      .attr('fill', '#fff')
      .classed('fill-square', function (d) { return d.fatal || d.nonFatal; })
      .attr('x', function (d) { return d.x;})
      .attr('y', function (d) { return d.y;})
      .attr('opacity', 0);

    // barchart
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
    var countryBars = g.selectAll('.country-bar').data(countryCounts);
    var countryBarsE = countryBars.enter()
      .append('rect')
      .attr('class', 'country-bar');
    countryBars = countryBars.merge(countryBarsE)
      .attr('x', function (d, i) { return countryBarsXScale(i);})
      .attr('y', height)
      .attr('fill', function (d, i) { return barColors[i]; })
      .attr('width', countryBarsXScale.bandwidth())
      .attr('height', 0);

    var carrierBars = g.selectAll('.carrier-bar').data(groupByCarrier);
    var carrierBarsE = carrierBars.enter()
      .append('rect')
      .attr('class', 'carrier-bar');
      carrierBars = carrierBars.merge(carrierBarsE)
      .attr('x', function (d, i) { return carrierBarsXScale(i);})
      .attr('y', height)
      .attr('fill', function (d, i) { return barColors[i]; })
      .attr('width', carrierBarsXScale.bandwidth())
      .attr('height', 0);

    var makeBars = g.selectAll('.make-bar').data(makeCounts);
    var makeBarsE = makeBars.enter()
      .append('rect')
      .attr('class', 'make-bar');
    makeBars = makeBars.merge(makeBarsE)
      .attr('x', function (d, i) { return makeBarXScale(i);})
      .attr('y', height)
      .attr('fill', function (d, i) { return barColors[i]; })
      .attr('width', makeBarXScale.bandwidth())
      .attr('height', 0);

    var phaseBars = g.selectAll('.phase-bar').data(phaseCounts);
    var phaseBarsE = phaseBars.enter()
      .append('rect')
      .attr('class', 'phase-bar');
    phaseBars = phaseBars.merge(phaseBarsE)
      .attr('x', function (d, i) { return phaseBarXScale(i);})
      .attr('y', height)
      .attr('fill', function (d, i) { return barColors[i]; })
      .attr('width', phaseBarXScale.bandwidth())
      .attr('height', 0);

  };

  var setupSections = function () {
    activateFunctions[0] = showTitle;
    activateFunctions[1] = showFillerTitle;
    activateFunctions[2] = showGrid;
    activateFunctions[3] = highlightGrid;
    activateFunctions[4] = highlightMoreGrid;
    activateFunctions[5] = showCountryBars;
    activateFunctions[6] = showCarrierBars;
    activateFunctions[7] = showMakeBars;
    activateFunctions[8] = showPhaseBars;

    for (var i = 0; i < 9; i++) {
      updateFunctions[i] = function () {};
    }
  };

  function showTitle() {
    g.selectAll('.count-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.openvis-title')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);
  }

  function showFillerTitle() {
    g.selectAll('.openvis-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.square')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.count-title')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);
  }

  function showGrid() {
    g.selectAll('.count-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.square')
      .transition()
      .duration(600)
      .delay(function (d) {
        return 5 * d.row;
      })
      .attr('opacity', 1.0)
      .attr('fill', '#ddd');
  }

  function highlightGrid() {
    if (lastIndex > activeIndex) {
    hideAxis();
    g.selectAll('.country-bar')
      .transition()
      .duration(600)
      .attr('y', height)
      .attr('height', 0);

    g.selectAll('.carrier-bar')
      .transition()
      .duration(600)
      .attr('y', height)
      .attr('height', 0);

    g.selectAll('.bar-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);


    g.selectAll('.square')
      .transition()
      .duration(0)
      .attr('opacity', 1.0)
      .attr('fill', '#ddd');

    g.selectAll('.fill-square')
      .transition('move-fills')
      .duration(800)
      .attr('x', function (d) {
        return d.x;
      })
      .attr('y', function (d) {
        return d.y;
      });
    }

    g.selectAll('.fill-square')
      .transition()
      .duration(800)
      .attr('opacity', 1.0)
      .attr('fill', function (d) { return d.fatal ? '#ff0000' : '#ddd'; });
  }

  function highlightMoreGrid() {
    if (lastIndex > activeIndex) {
      hideAxis();
    g.selectAll('.country-bar')
      .transition()
      .duration(600)
      .attr('y', height)
      .attr('height', 0);

    g.selectAll('.bar-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);


    g.selectAll('.square')
      .transition()
      .duration(0)
      .attr('opacity', 1.0)
      .attr('fill', '#ddd');

    g.selectAll('.fill-square')
      .transition('move-fills')
      .duration(800)
      .attr('x', function (d) {
        return d.x;
      })
      .attr('y', function (d) {
        return d.y;
      });
    }

    g.selectAll('.fill-square')
      .transition()
      .duration(800)
      .attr('opacity', 1.0)
      .attr('fill', function (d) {
        if (d.fatal) {
          return '#ff0000';
        } else if (d.nonFatal) {
          return '#ffb400'
        } else {
          return '#ddd';
        }
      });
  }

  function showCountryBars() {
    // ensure bar axis is set
    showAxis(countriesXAxis, countriesYAxis);
    // aldjflsdfljsfkasfasdfaslfaslfkslfslljfslsflsjjsiwoixlcdmcmka skdfljsfljslfjljfsldfslkfslksjlfkjslkjsdflkjasdlkfjsdfljsdlkfjsdflkjsdfoejfoxkdjfosdifjsldfsldfjsfdlsdflkjsdfljelsdfsldkfsfslfjsldfjsdsdkfjsdlkfjslfdkjfljlkfjslfjslfjslfjslfjsdlfjijljdfjsflkjsdlkjsdflksjflksdjflskjdf dfjsfkjsdkfjslkdjflsdkfjsdlkjdskslkjfsdkfjsdlfjsidjfsfjsdofjsdlfjsdlfkjifoiajfliasjdfljsldfjlsfjsljfsldfsfsjflsdfsfslflskfjsdjfoeifsljdficjvknnvjhgiooij48938ui3jjkwefwejkfweofewioujsjdfweklfjwoeifjiowekjfewkfjklwfjklwefjlkwejfiowewohwoiur982984idhfksdfksdfsdfwefisfklsdfidsjfisjfsweoifjkcnvjfugweifewifsejfksjiosdfsjfsfjjsdfsifoisjfioj

    g.selectAll('.square')
      .transition()
      .duration(800)
      .attr('opacity', 0);

    g.selectAll('.fill-square')
      .transition()
      .duration(800)
      .attr('opacity', 0);

    g.selectAll('.country-bar')
      .transition()
      .duration(600)
      .attr('y', function (d) { return 50 + countryBarYScale(d.value) })
      .attr('height', function (d) { return height - 50 - countryBarYScale(d.value); });

    g.selectAll('.carrier-bar')
      .transition()
      .duration(600)
      .attr('y', height)
      .attr('height', 0);

    g.selectAll('.bar-text')
      .transition()
      .duration(600)
      .delay(1200)
      .attr('opacity', 1);
  }

  function showCarrierBars() {
    // switch the axis to histogram one
    showAxis(carriersXAxis, carriersYAxis);

    g.selectAll('.country-bar')
      .transition()
      .duration(600)
      .attr('y', height)
      .attr('height', 0);
    
    g.selectAll('.make-bar')
      .transition()
      .duration(600)
      .attr('y', height)
      .attr('height', 0);

    g.selectAll('.carrier-bar')
      .transition()
      .duration(600)
      .attr('y', function (d) { return 50 + carrierBarYScale(d.value) })
      .attr('height', function (d) { return height - 50 - carrierBarYScale(d.value); });
  }

  function showMakeBars() {
    // ensure the axis to histogram one
    showAxis(makesXAxis, makesYAxis);

    g.selectAll('.carrier-bar')
      .transition()
      .duration(600)
      .attr('y', height)
      .attr('height', 0);

    g.selectAll('.phase-bar')
      .transition()
      .duration(600)
      .attr('y', height)
      .attr('height', 0);

    g.selectAll('.make-bar')
      .transition()
      .duration(600)
      .attr('y', function (d) { return 50 + makeBarYScale(d.value) })
      .attr('height', function (d) { return height - 50 - makeBarYScale(d.value); });
  }

  function showPhaseBars() {
    // ensure the axis to histogram one
    showAxis(phaseXAxis, phaseYAxis);

    g.selectAll('.make-bar')
      .transition()
      .duration(600)
      .attr('y', height)
      .attr('height', 0);

    g.selectAll('.phase-bar')
      .transition()
      .duration(600)
      .attr('y', function (d) { return 50 + phaseBarYScale(d.value) })
      .attr('height', function (d) { return height - 50 - phaseBarYScale(d.value); });
  }

  function showAxis(xAxis, yAxis) {
    g.select('.x.axis')
      .transition().duration(500)
      .call(xAxis)
      .style('opacity', 1);
    g.select('.y.axis')
      .transition().duration(500)
      .call(yAxis)
      .style('opacity', 1);
  }

  function hideAxis() {
    g.select('.x.axis')
      .transition().duration(500)
      .style('opacity', 0);
    g.select('.y.axis')
      .transition().duration(500)
      .style('opacity', 0);
  }
  
  function getAccidents(rawData) {
    return rawData.map(function (d, i) {
      d.fatal = (d.Total_Fatal_Injuries != '0') ? true : false;
      d.nonFatal = (d.Injury_Severity == 'Non-Fatal') ? true : false;
      d.col = i % numPerRow;
      d.x = d.col * (squareSize + squarePad);
      d.row = Math.floor(i / numPerRow);
      d.y = d.row * (squareSize + squarePad);
      return d;
    });
  }

  function getFatalAccidents(data) {
    return data.filter(function (d) {return d.fatal; });
  }

  function getNonFatalAccidents(data) {
    return data.filter(function (d) {return d.nonFatal; });
  }

  function groupByCountry(accidents) {
    return d3.nest()
      .key(function (d) { return d.Country; })
      .rollup(function (v) { return v.length; })
      .entries(accidents)
      .sort(function (a, b) {return b.value - a.value;});
  }

  function getCarrierArray(data, carrier, carrierAlias) {
    return data.filter(function(d) { return (d.Air_Carrier.toLowerCase().includes(carrier) ||  d.Air_Carrier.toLowerCase().includes(carrierAlias)) });
  }

  function groupByMake(accidents) {
    return d3.nest()
      .key(function (d) { return d.Make; })
      .rollup(function (v) { return v.length; })
      .entries(accidents)
      .sort(function (a, b) {return b.value - a.value;});
  }

  function groupByPhase(accidents) {
    return d3.nest()
      .key(function (d) { return d.Broad_Phase_of_Flight; })
      .rollup(function (v) { return v.length; })
      .entries(accidents)
      .sort(function (a, b) {return b.value - a.value;});
  }

  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;
};

function display(data) {
  // create a new plot and
  // display it
  var plot = scrollVis();
  d3.select('#vis')
    .datum(data)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
}

// load data and display
d3.csv('data/accidents.csv', display);
