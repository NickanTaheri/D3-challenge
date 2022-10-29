// Get the source data endpoint
const _source = `https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json`;

// Show the data on console
d3.json(_source).then(function (data) {

  console.log(data);

  var names = data.names;

  names.forEach((name) => {
    d3.select("#selDataset")
      .append("option")
      .text(name)
      .property("value", name);
  });

  // initial plots
  var iniVal = names[0];
  _chart(iniVal);
  _metadata(iniVal);

})


function optionChanged(_newSample) {
  // Fetch new data each time a new sample is selected
  _chart(_newSample);
  _metadata(_newSample);
}


function _metadata(test) {
  d3.json((_source)).then((data) => {
    var _metadata = data.metadata;

    //filter data by subject ID
    var _filterList = _metadata.filter(sampleObject => sampleObject.id == test);
    var _filteredList = _filterList[0];

    var _metaPanel = d3.select("#sample-metadata");
    _metaPanel.html("");

    //Populate demographic info table
    Object.entries(_filteredList).forEach(([_key, _value]) => {
      _metaPanel.append("h6").text(`${_key}: ${_value}`)
    })
  });
};

function _chart(sample) {
  d3.json((_source)).then((data) => {

    var _samplesVal = data.samples;
    var _filterList = _samplesVal.filter(sampleObject => sampleObject.id == sample);
    var _filteredList = _filterList[0];
    var _Val = _filteredList.sample_values;
    var _otuIds = _filteredList.otu_ids;
    var _otuLabels = _filteredList.otu_labels;

    // Bar Chart
    var _barChart = {
      x: _Val.slice(0, 10).reverse(),
      y: _otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      text: _otuLabels.slice(0, 10).reverse(),
      name: "Greek",
      type: "bar",
      orientation: "h"
    };

    _barLayout = {
      margin: { l: 150, r: 0, t: 100, b: 100 }
    };

    _barData = [_barChart];

    Plotly.newPlot("bar", _barData, _barLayout);


    // Bubble Chart
    var _bubbleChart = {
      x: _otuIds,
      y: _Val,
      text: _otuLabels,
      mode: 'markers',

      marker: {
        color: _otuIds,
        size: _Val,
        colorscale: "Rainbow"
      }
    };

    _bubbleLayout = {
      showlegend: false,
      hovermode: 'closest',
      xaxis: { title: "OTU ID"},

      margin: { t: 30 }
    };
    
    _bubbleData = [_bubbleChart];

    Plotly.newPlot('bubble', _bubbleData, _bubbleLayout);
  });
};
