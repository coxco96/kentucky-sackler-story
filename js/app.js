

    var map = L.map('map').setView([37.560, -85.482], 7.4, {
        minZoom: 6,
        maxZoom: 9,
        zoomSnap: 0.1,
        zoomControl: false,
  
        //maxBounds: L.latLngBounds([-6.22, 27.72], [5.76, 47.83]),
    });
    

    // mapbox API access Token
  //  var accessToken = "pk.eyJ1IjoiY294Y285NiIsImEiOiJja3BrY2k0ZHgwa3Y0MnZwYTl3NWs4emJ5In0.ItwJEcRmF0LwO1DkHFgpZw";

    // request a mapbox raster tile layer and add to map
    L.tileLayer(
        `https://api.mapbox.com/styles/v1/coxco96/ckwpuursz33ao15ohyw9i97ef/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY294Y285NiIsImEiOiJja3BrY2k0ZHgwa3Y0MnZwYTl3NWs4emJ5In0.ItwJEcRmF0LwO1DkHFgpZw`, {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            //id: "light-v10",
            accessToken: 'pk.eyJ1IjoiY294Y285NiIsImEiOiJja3BrY2k0ZHgwa3Y0MnZwYTl3NWs4emJ5In0.ItwJEcRmF0LwO1DkHFgpZw',
            //mapbox://styles/coxco96/ckwpuursz33ao15ohyw9i97ef
        }
    ).addTo(map);


    


  // omnivore.csv("data/pharmwithlatlon.csv").addTo(map);

    // check for errors

    omnivore
        .csv("data/pharmwithlatlon.csv")
        .on("ready", function (e) {
            console.log("all good so far");
            console.log(e.target);
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
                        weight: 2,
                        fillOpacity: 0,
                    });
                },
            };
            // create 2 separate layers from geoJSON data
            const pharmLayer = L.geoJson(data, options).addTo(map);
            
    
            // color the layers different colors
            pharmLayer.setStyle({
               color: "red",
               opacity: .2
            });
    
    
            // fit the bounds of the map to one of the layers
            map.fitBounds(pharmLayer.getBounds(), {
                padding: [50, 50],
            });
           
    
           //resizeCircles(pharmLayer, 2006);
            //sequenceUI(pharmLayer);
    
        } // end drawMap()



        


       




        











