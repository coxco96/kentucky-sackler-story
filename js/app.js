

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


    console.log("hi!")


    omnivore.csv("data/pharmwithlatlon.csv").addTo(map);

















