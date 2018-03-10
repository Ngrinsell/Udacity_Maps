//hard coded locations
var locations = [
    {
		name: 'AmStar Cinemas',
        location: {lat: 28.789989, lng: -81.356269},
        id: "ChIJBTRHN0AN54gRsDT79N1crAs"
	},
    {
		name: 'Dexter\'s',
        location: {lat: 28.789339, lng: -81.356481},
        id: "ChIJa4LGeEEN54gRbINZFukUA3Y"
	},
    {
		name: 'Graffiti Junktion',
        location: {lat: 28.789213, lng: -81.356915},
        id: "ChIJa4LGeEEN54gRVCrAaZCet4w"
	},
    {
		name: 'Cold Stone Creamery',
        location: {lat: 28.789835, lng: -81.355905},
        id: "ChIJBTRHN0AN54gRGuYFtmJ_ICQ"
	},
    {
		name: 'Moe\'s Southwest Grill',
        location: {lat: 28.785595, lng: -81.356420},
        id: "ChIJHx1YSLZs54gROaVuxO-hy50" 
	},
    {
		name: '7-Eleven',
        location: {lat: 28.7865285, lng: -81.340953},
        id: "ChIJD1N9XF8N54gRG-PWCiKSZlo"
	},
    {
		name: 'Walgreens',
        location: {lat: 28.785783, lng: -81.358670},
        id: "ChIJGccRs0YN54gRpz4nTeyOpyc"
	},
];

/*Constructor for conversion to observable*/
var Place = function(info){
    this.title = info.name;          //from above array
    this.position = info.location;  //from above array
    this.placeID = info.id;
    this.marker = null;             //marker id will be assigned later
};

//initialize maps
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 28.789678, lng: -81.348746},
          zoom: 15,
          /*styles: styles,*/
          mapTypeControl: false
    });
    
    ko.applyBindings(new ViewModel()); 
}

//function to handle errors
function error(){
    alert("Maps has failed to load.  Please try again later.");
}

//menu function
$('.menuButton').click(function(){
    if($("svg").hasClass("fa-caret-square-right")){
        $("#menu").css("left", "0px");
        $("svg").removeClass("fa-caret-square-right");
        $("svg").addClass("fa-caret-square-left");
    }
    else{
        $("#menu").css("left", "-290px");
        $("svg").removeClass("fa-caret-square-left");
        $("svg").addClass("fa-caret-square-right");
    }
});