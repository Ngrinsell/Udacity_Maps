//global variables
var map;
var infoWindow;
var markers = [];

function ViewModel(){
    //for use with foreach loops
    var that = this;
    
    //observables
    this.locationList = ko.observableArray(""); /*user search query*/
    this.filteredList = ko.observableArray(""); /*array to display search results*/
    this.queryData = ko.observable(""); /*user search query*/
    
    //fill markers array
    locations.forEach(function(place) {    
        markers.push(new Place(place));
    });
    
    //fill ko array with places*
    markers.forEach(function(place) {
        that.filteredList.push(place);
    });
    
    
    //create markers/info windows from markers array
    for (var i = 0, markLength = markers.length; i < markLength; i++) {
        markers[i].marker = new google.maps.Marker({
            position: markers[i].position,
            map: map,
            animation: google.maps.Animation.DROP,
            id: markers[i].placeID
        });
        
        //create info windows
        var placeInfoWindow = new google.maps.InfoWindow({
            maxWidth: 200,
        });
        
        //show window on click
         markers[i].marker.addListener('click', function() {
             //bounce icon
             animate(this);
    
             getPlacesDetails(this, placeInfoWindow);
             
         });
        
        //show window when list clicked
        this.windowDisplay = function(place) {
            var marker = place.marker;
            
            //bounce icon
            animate(marker);
    
            placeInfoWindow.open(map, place.marker);
            getPlacesDetails(place.marker, placeInfoWindow);
        };
    }
    
    //bounce animation function
    function animate(marker){
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 500);
    }
    
    //get data for info window
    function getPlacesDetails(marker, infowindow) {
        
        if(infowindow.marker != marker){
            infowindow.setContent(""); //stop glichy loading from one place to another
        }
        
        //get place information, per Udacity course examples
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({
            placeId: marker.id
            }, function(place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // Set the marker property on this infowindow so it isn't created again.
                    infowindow.marker = marker;
                    var innerHTML = "<div class='infoWindow'>";
                    if (place.name) {
                        innerHTML += "<p class='name'>" + place.name + "</p>";
                    }
                    if (place.formatted_address) {
                        innerHTML += "<p class='address'>" + place.formatted_address + "</p>";
                    }
                    if (place.formatted_phone_number) {
                        innerHTML += "<p class='phone'>" + place.formatted_phone_number + "</p>";
                    }
                    if (place.photos) {
                        innerHTML += "<img src='" + place.photos[0].getUrl(
                            {maxHeight: 100, maxWidth: 200}) + "' class='image'>";
                    }
                    innerHTML += '</div>';
                    // Built by LucyBot. www.lucybot.com
                    //Resource from developer.nytimes.com
                    //modification made on done function
                    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
                    url += '?' + $.param({
                        'api-key': "76728a6e3c124b25a839132c90fda744",
                        'q': place.name,
                        'fl': "web_url"
                    });
                    $.ajax({
                        url: url,
                        method: 'GET',
                    }).done(function(result) {
                        console.log(result);
                        //get result, parse it, save in HTML usable format, append to infowindow
                        //Shows link if article exists, shows explanation if it doesn't
                        var linkCode;
                        
                        if(result.response.docs.length !== 0){
                            var firstEntry = result.response.docs[0].web_url;
                            linkCode = "<a href='" + firstEntry + "' target='_blank' class='article'>Related NYT Article</a>";
                        }
                        else{
                           linkCode = "<p class='article'>No Realted NYT Article</p>"; 
                        }
                        
                        $(linkCode).insertAfter(".phone");
                    }).fail(function(err) {
                        throw err;
                    }); 
            
                    //complete infowindow set up
                    infowindow.setContent(innerHTML);
                    infowindow.open(map, marker);
                    // Make sure the marker property is cleared if the infowindow is closed.
                        infowindow.addListener('closeclick', function() {
                        infowindow.marker = null;
                    });
                }
            });
        }
    
    //set all markers to true for inital viewing of list
    markers.forEach(function(place) {
        place.marker.setVisible(true);
    });
    
    //fill locations to user and filter
    that.displayResults = function() {
        that.filteredList.removeAll(); //start fresh on each update
        var search = that.queryData().toLowerCase(); //make comparison easier
        var regex;
            
        //check for matches, if there is a match, add to the filter array
        markers.forEach(function(place) {
            regex = new RegExp("\s*[a-z0-9'-]*\s*" + search + "\s*[a-z0-9'-]*\s*");
            //hide initially, show if they match the search
            place.marker.setVisible(false);
            
            //check if search query matches any location titles
            if(regex.test(place.title.toLowerCase())){
                that.filteredList.push(place); 
            }
            
            //set matching search markers to showing
            that.filteredList().forEach(function(place) {
                place.marker.setVisible(true);
            });
        });
    };
}
