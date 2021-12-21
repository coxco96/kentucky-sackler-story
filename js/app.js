const map = L.map('map').setView([38.360, -85.482], 7.4, {
    zoomSnap: .1,
    zoomControl: false,
    maxBounds: L.latLngBounds([38.843986,-89.2957132], [36.549362,-80.918608]),
    keyboard: false
}
).setMaxZoom(12)
.setMinZoom(6);

map.removeControl(map.zoomControl); // I don't under why I had to use this to get the zoom control off when zoomControl is set to false



// load pharmacy data
omnivore
    .csv("mydata/updatedpharmcsv.csv")
    .on("ready", function (e) {
        console.log("all good so far");
       // console.log(e.target);
        // getPharmTotals(totalPharmPills);
        drawMap(e.target.toGeoJSON());
        // drawLegend(e.target.toGeoJSON());
    })
    .on("error", function (e) {
        console.log("there's a problem");
        console.log(e.error[0].message);
    });





function drawMap(data) {
    // access to data here
    console.log(data);
    const options = {
        pointToLayer: function (feature, ll) {
            return L.circleMarker(ll, {
                opacity: 1,
                weight: 1.5,
                fillOpacity: .01,
                radius: 10
            });
        },
    };
    // create a layer from geoJSON data
    const pharmLayer = L.geoJson(data, options).addTo(map);


    // color the layers different colors
    pharmLayer.setStyle({
        color: "#fc0808", // lightblue and red both look nice
        opacity: .65,
        fillOpacity: .1
    });


    // fit the bounds of the map to one of the layers
    map.fitBounds(pharmLayer.getBounds(), {
        padding: [50, 50],
    });

    //getPharmTotals(totalPharmPills)
    resizeCircles(pharmLayer, 2007);
    sequenceUI(pharmLayer);

} // end drawMap()



function calcRadius(val) {
    const radius = Math.sqrt(val / Math.PI);
    return radius; // adjust .5 as a scale factor
} // end calcRadius function




// function getPharmTotals(json) {
//     const pharmTotals = json;
//     return pharmTotals;
//     //console.log(pharmTotals);

// } // end getPharmTotals


function resizeCircles(pharmLayer, year) {
    pharmLayer.eachLayer(function (layer) {
        const radius = (calcRadius(
            Number(layer.feature.properties[year]))*6);
        layer.setRadius(radius);
    });

    retrieveInfo(pharmLayer, year);
} // end resizeCircles




function retrieveInfo(pharmLayer, year) {

    // select the element and reference with variable
    const info = document.querySelector('#infoBox');

    // detect mouseover events
    pharmLayer.on("mouseover", function (e) {
       info.style.display = "block";
       

         // raise opacity level as visual affordance
         e.layer.setStyle({
            fillOpacity: .8,
        });

        // access properties of target layer
    const props = e.layer.feature.properties;

    

   info.innerHTML = `<span style=" background-color: red">${props.BUYER_NAME}</span> distributed <span style=" background-color: red">${Number(props[year]).toFixed(2)}</span> hydrocodone and oxycodone pills per person in ${props.BUYER_COUNTY} County in ${year}.`;


    }) // end mouseover

    pharmLayer.on("mouseout", function(e) {
        info.innerHTML = 'Hover over each pharmacy to explore how many pills it distributed.';
        e.layer.setStyle({
            fillOpacity: 0
           
        })
    }) // end mouseout


} // end retrieveInfo


function sequenceUI(pharmLayer) {
    //console.log("sequence ui")
  // create Leaflet control for the slider
  const sliderControl = L.control({
    position: "topleft",
});


sliderControl.onAdd = function (map) {
    const controls = L.DomUtil.get("slider");

    L.DomEvent.disableScrollPropagation(controls);
    L.DomEvent.disableClickPropagation(controls);

    return controls;
};

// add it to the map
sliderControl.addTo(map);

// add sliderYear info box
const sliderYear = L.control({
    position: "bottomleft",
});

// when the sliderYear box is added to the map
sliderYear.onAdd = function () {
    // select the slider grade box using id of it
    const sliderBox = L.DomUtil.get("sliderYear");
    // disable scroll and click functionality
    L.DomEvent.disableScrollPropagation(sliderBox);
    L.DomEvent.disableClickPropagation(sliderBox);
    // document.querySelector("#sliderYear span").innerHTML = `${currentGrade}`;
    

    // return the selection
    return sliderBox;
};
    sliderYear.addTo(map);
    //console.log(currentGrade);
    //console.log(document.querySelector("#sliderYear"));

     // select the slider's input and listen for change
     const slider = document.querySelector("#slider input");
     // select the slider's input and listen for change
     slider.addEventListener("input", function (e) {
         console.log(e.target.value);


         // current value of slider is current grade level
         var year = e.target.value;
         console.log(year);
         

         // resize the circles with updated grade level
         resizeCircles(pharmLayer, year);

             document.querySelector("#sliderYear").innerHTML = `Year: ${year}`;
           
         

     });


} // end sequenceUI





/// second map

if (L.Browser.mobile) {
    var options = {
        //center: [37.8, -85.8],
        // zoom: 5.6,
        //minZoom: 5.6,
        //maxZoom: 5.6,
        zoomSnap: .3,
        zoomControl: false
    }

    document.querySelector('mapTwo').style.height = '350px';


} else {
    var options = {
        center: [37.8, -85.8],
        zoom: 7.1,
        minZoom: 7.1,
        maxZoom: 7.1,
        zoomSnap: .3,
        zoomControl: false,

    }

}







// create a Leaflet map in our division container with id of 'map'
const mapTwo = L.map('mapTwo').setView([38.360, -85.482], 7.4, options).setMaxZoom(12).setMinZoom(6);
mapTwo.removeControl(mapTwo.zoomControl);





var annualPills = 'kyoxydata_pillsperperson';

var countyName = 'NAME';

var countyLayer = $.getJSON("mydata/kyoxybycounty.json", function (data) {
    console.log("we're in the json function");
    //data loaded from the file is now accessible here within this function
    var dataLayer = L.geoJson(data, {
        style: function (feature) {
            return {
                color: '#2e2e2e',
                weight: 1.2,
                fillOpacity: .95,
                fillColor: '#1f78bf'
            };
        }
    })

    //we're still in the $.getJSON function

    dataLayer.addTo(mapTwo);
    drawMapTwo(dataLayer);
    console.log(dataLayer.getBounds())
    mapTwo.fitBounds(dataLayer.getBounds());

    

    dataLayer.eachLayer(function (layer) {
        var props = layer.feature.properties;
       // console.log(props);
        if (props[annualPills] != 'null') {
            var toolTipInfo =
                `<h3 class="tooltip">${(props[countyName])} County: <br> ${(props[annualPills])} pills per person per year</h3>`;
        } else {
            var toolTipInfo =
                `<h3 class="tooltip>${(props[countyName])} County <br> data unavailable</h3>`;
        }

        //console.log(props);
        if (L.Browser.mobile) {
            layer.bindPopup(toolTipInfo, {
                sticky: true,
                maxHeight: 150,
                opacity: .8,
                autoPan: false,
                maxWidth: 120,
                keepInView: true,
                className: 'leaflet-mobile-popup'
            }).addTo(mapTwo);

        } else {

            layer.bindTooltip(toolTipInfo, {
                sticky: true,
                opacity: .8,
            }).addTo(mapTwo);
        }
    });
}); // end $.getJSON function





//	FUNCTIONS:

function drawMapTwo(dataLayer) {
    var breaks = getClassBreaks(dataLayer);
    dataLayer.eachLayer(function (layer) {
        var props = layer.feature.properties;
        layer.setStyle({
            fillColor: getColor(props[annualPills], breaks),
            fillOpacity: .95,
            opacity: .5,
            weight: 1.5,
            color: "ivory"
          
            
        });
    });
    drawLegend(breaks);

} // end drawMapTwo()


function getClassBreaks(dataLayer) {
    var values = [];
    dataLayer.eachLayer(function (layer) {
        var props = layer.feature.properties;
        var value = Number(props[annualPills]);
        //console.log(typeof (value));

        if (props[annualPills] != 0 && value != null) {
            values.push(value);
            //	console.log(values);
        }
    });
    //determine similar clusters 
    var clusters = ss.ckmeans(values, 5);
    //console.log(clusters);


    var breaks = clusters.map(function (cluster) {
        return [cluster[0], cluster.pop()];
    });

    //console.log(breaks);
    return breaks;
} // end of classBreaks function






function getColor(value, data) {
    if (value <= 30.0) {
        var color = '#ffa1a1';
        return color;
    } else if (value <= 45.0) {
        var color = '#ff6e6e';
        return color;
    } else if (value <= 60.0) {
        var color = '#E60000';
        return color;
    } else if (value <= 75.0) {
        var color = '#BF0000';
        return color;
    } else if (value <= 99999) {
        var color = '#8C0000';
        return color;
    }
}



myObject = {

    classOne: {
        color: '#ffa1a1',
        range: [1, 30]
    },
    classTwo: {
        color: '#ff6e6e',
        range: [31, 45]
    },
    classThree: {
        color: '#E60000',
        range: [46, 60]
    },
    classFour: {
        color: '#BF0000',
        range: [61, 75]
    },
    classFive: {
        color: '#8C0000',
        range: [76, 185]
    }


}

console.log(Object.keys(myObject).length);

var howManyClasses = Object.keys(myObject).length;

eachClass = Object.keys(myObject);
console.log(eachClass);

function drawLegend(color) {
    //create leaflet control and position:

    if (L.Browser.mobile) {
        var legend = L.control({


            position: 'topleft'

        });
    } else {
        var legend = L.control({
            position: 'topleft'
        })
    }
    //when it's added to the map:
    legend.onAdd = function () {
        //create a new HTML <div> element with a class name of "legend":
        var div = L.DomUtil.create('div', 'legend');
        //insert placeholder text for now if needed:
        div.innerHTML =
            `<h3>Pills per person</h3><span style ="background: ivory"></span><label>Data unavailable</label>`

        for (let key in myObject) {

            //var legendColor = [key][color];
            console.log(myObject[key]["color"]);
            var legendColor = myObject[key]["color"];
            var legendDescription =
                `${myObject[key]["range"][0]} - ${myObject[key]["range"][1]}`;
            //concatenate a <span> tag styled with the color and the range value of that class and include a label with the low and high ends of that class range:
            div.innerHTML +=
                `<span style ="background: ${legendColor}"></span><label>${legendDescription}</label>`;
            //console.log(color)
        }
        //return div element (return populated div to be added to map):
        return div;
    }; // end onAdd method
    //add legend to map:
    legend.addTo(mapTwo);

} // end drawLegend function









