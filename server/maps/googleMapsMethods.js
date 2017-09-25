const request = require('request');
const dataDbMethods = require('../dataMethods');
const async = require('async');



module.exports = {
    search,
    test,
    getNearby
}

var googleMapsClient = require('@google/maps').createClient({
  key: "AIzaSyCuBnHq7R4rNdk-QfNh-U7-m0rZG-eFRF0"
});

// ROUTE SEARCH //
function search(req, res) {
    var string = ("https://maps.googleapis.com/maps/api/directions/json?");
    // {
    //   origin: LatLng | String | google.maps.Place,
    //   destination: LatLng | String | google.maps.Place,
    //   travelMode: TravelMode,
    //   transitOptions: TransitOptions,
    //   drivingOptions: DrivingOptions,
    //   unitSystem: UnitSystem,
    //   waypoints[]: DirectionsWaypoint,
    //   optimizeWaypoints: Boolean,
    //   provideRouteAlternatives: Boolean,
    //   avoidHighways: Boolean,
    //   avoidTolls: Boolean,
    //   region: String
    // }

    string += "origin=Toronto"
    string += "&destination=Montreal"
    string += "&key=AIzaSyCuBnHq7R4rNdk-QfNh-U7-m0rZG-eFRF0"
    var options = {
        url: string
    }
    function callback(err, res, body) {
        if (err) {
            console.log("Issue")
        }
        else {
            var payload = JSON.parse(body);
            send(payload);
        }
    }
    request(options, callback);
    function send(payload) {
        res.status(200).send(payload);
    }
}

function test(req, res) {
    var latitude = 53.349031
    var longitude = -6.237262
    var googleUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
    var location = "location=" + latitude + "," + longitude
    var details = "&type=train_station&radius=10000&key=AIzaSyAM5n9_VLv2HN0-1DXvDIys6K8BLShXrh8"
    var googleCall = googleUrl + location + details

    //light_rail_station = LUAS
    //bus_station = BUS
    //train_station = DART

    request(googleCall, function(err,res2,body) {
        if (err) {
            console.log(err)
        }
        else {
            res.status(200).send(body)
        }
    });
}

function getNearby(req, res) {
    const latitude = req.params.latitude
    const longitude = req.params.longitude
    const nearbyUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
    const location = "location=" + latitude + "," + longitude
    const details = "&type=transit_station&key=AIzaSyAM5n9_VLv2HN0-1DXvDIys6K8BLShXrh8&radius="
    const initialUrl = nearbyUrl + location + details


    function compareLatLong(lat1,long1, nearbyArray) {
        lat2Num = parseFloat(String(lat1).slice(0,(lat1+"").indexOf('.')+5))
        long2Num = parseFloat(String(long1).slice(0,(long1+"").indexOf('.')+5))
        for (var i = 0; i < nearbyArray.length; i++) {
            var lat1 = nearbyArray[i].geometry.location.lat
            var long1 = nearbyArray[i].geometry.location.lng
            var lat1Num = parseFloat(String(lat1).slice(0,(lat1+"").indexOf('.')+5))
            var long1Num = parseFloat(String(long1).slice(0,(long1+"").indexOf('.')+5))
            if ((lat1Num-0.0001<=lat2Num) & (lat2Num<=lat1Num+0.0001) & (long1Num-0.0001<=long2Num) & (long2Num<=long1Num+0.0001)){
                return true
            }
            else if (i == nearbyArray.length-1){
                return false
            }
        }
    }

    function send(err, obj) {
        if (err) {
            return res.status(err.error).send(err)
        }
        return res.status(obj.status).send(obj.body);
    }

    function getRealTime(url, radius){
        if (radius > 4000) {
            var error = {
                "error" : 418,
                "message" : "There is no bus stops nearby"
            }
            return send(error) 
        }
        request(url+String(radius), function(err, res, gBody) {
            if (err) {
                send(err)
            }
            const results = JSON.parse(gBody).results
            if (results.length == 0) {
                return getRealTime(url, radius*3)
            }
            var stopIds = []
            dataDbMethods.getBusStops((err, stops) => {
                if (err) {
                    return send(err)
                }
                for (var i = 0; i < stops.length; i++) {
                    var validStop = compareLatLong(stops[i].latitude,stops[i].longitude, results)
                    if (validStop) {
                        stopIds.push({
                            "name" : stops[i].shortname,
                            "latitude" : stops[i].latitude,
                            "longitude" : stops[i].longitude,
                            "id" : stops[i].stopid
                        })
                    }
                    if (stopIds.length == results.length || i == stops.length-1) {
                        var realTimeInfo = []
                        async.each(stopIds, (stop, next) => {
                            var busUrl = "https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=" + stop.id +"&format=json"
                            request(busUrl, (err, res, body) => {
                                if (err) {
                                    return next(err)
                                }
                                realTimeInfo.push({
                                    "name" : stop.name,
                                    "latitude" : stop.latitude,
                                    "longitude" : stop.longitude,
                                    "realTimeInfo" : JSON.parse(body)
                                })
                                return next();
                            })
                        }, err => {
                            if (err) {
                                return send(err)
                            }
                            return send(null, {"status" : 200, "body" : realTimeInfo});
                        });
                        break
                    };
                };
            });
        });
    }

    getRealTime(initialUrl, 25)

    var url = 'https://data.dublinked.ie/cgi-bin/rtpi/busstopinformation?stopid&format=json'
    request(url, function(err, res, body) {
        if (err) {
            console.log(err)
        }
        else {
            var stops = JSON.parse(body).results
            var minimalStops = []
            for (var i = 0; i < stops.length; i++){
                minimalStops.push({
                    "stopid" : stops[i].stopid,
                    "shortname" : stops[i].shortname,
                    "latitude" : stops[i].latitude,
                    "longitude" :  stops[i].longitude
                })
                if (i == stops.length-1){
                    dataDbMethods.updateBusStops(minimalStops);
                }
            }

        }
    });
}
// new Promise((resolve, reject) => {

// }).then(() => {
//     // I GOT DAT SHIT
// })