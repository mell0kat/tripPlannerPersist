$(function () {

    var map = initialize_gmaps();

    var days = [
        []
    ];

    var currentDay = 1;

    var placeMapIcons = {
        activities: '/images/star-3.png',
        restaurants: '/images/restaurant.png',
        hotels: '/images/lodging_0star.png'
    };

    var $dayButtons = $('.day-buttons');
    var $addDayButton = $('.add-day');
    var $placeLists = $('.list-group');
    var $dayTitle = $('#day-title');
    var $addPlaceButton = $('.add-place-button');

    var createItineraryItem = function (placeName) {
        console.log(placeName, "place name")

        var $item = $('<li></li>');
        var $div = $('<div class="itinerary-item"></div>');

        $item.append($div);
        $div.append('<span class="title">' + placeName + '</span>');
        $div.append('<button class="btn btn-xs btn-danger remove btn-circle">x</button>');
        
        return $item;

    };

    var setDayButtons = function () {
        $dayButtons.find('button').not('.add-day').remove();
        days.forEach(function (day, index) {
            $addDayButton.before(createDayButton(index + 1));
        });
    };

    var getPlaceObject = function (typeOfPlace, nameOfPlace) {

        var placeCollection = window['all_' + typeOfPlace];

        return placeCollection.filter(function (place) {
            return place.name === nameOfPlace;
        })[0];

    };

    var getIndexOfPlace = function (nameOfPlace, collection) {
        var i = 0;
        for (; i < collection.length; i++) {
            if (collection[i].place.name === nameOfPlace) {
                return i;
            }
        }
        return -1;
    };

    var createDayButton = function (dayNum) {
        return $('<button class="btn btn-circle day-btn"></button>').text(dayNum);
    };

    var reset = function () {

        var dayPlaces = days[currentDay - 1];
        if (!dayPlaces) return;

        $placeLists.empty();

        dayPlaces.forEach(function (place) {
            place.marker.setMap(null);
        });

    };

    var removeDay = function (dayNum) {

        if (days.length === 1) return;

        reset();

        days.splice(dayNum - 1, 1);

        setDayButtons();
        setDay(1);

    };
   
    var currentDay = 1;

    //add 1 day to mongo if it doesnt exist:
    // createDayInDb(1);

    // $.get('/api/days', function(data){
    //     var currentNumOfDays = days.length;
    //     numDays = currentNumOfDays;
    //     days.forEach(function(day){
    //         setDayButtons();
    //         })
    //     // setDayButtons();
    //     setDay(1);
    // })
    //     .fail( function (err) {console.error('err', err)} );
    

    // var showDays = function (){
        
    //     var currentNumOfDays = days.length;
    //     var $newDayButton = createDayButton(currentNumOfDays + 1);

    //     $addDayButton.before($newDayButton);
    //     days.push([]);
    //     setDayButtons();
    //     setDay(currentNumOfDays + 1);

    //     // $.ajax({
    //     //     method: 'POST',
    //     //     url: '/api/days/',
    //     //     data: {dayNum: ++currentNumOfDays},
    //     //     success: function (responseData) {
    //     //         console.log("success")
    //     //     },
    //     //      error: function (errorObj) {
    //     //     // some code to run if the request errors out
    //     //     }
    //     // })

        
    // }

    var mapFit = function () {

        var bounds = new google.maps.LatLngBounds();
        var currentPlaces = days[currentDay - 1];

        currentPlaces.forEach(function (place) {
            bounds.extend(place.marker.position);
        });

        map.fitBounds(bounds);

    };

    var setDay = function (dayNum) {

        if (dayNum > days.length || dayNum < 0) {
            return;
        }

        var placesForThisDay = days[dayNum - 1];
        var $dayButtons = $('.day-btn').not('.add-day');

        reset();

        currentDay = dayNum;

        placesForThisDay.forEach(function (place) {
            $('#' + place.section + '-list').find('ul').append(createItineraryItem(place.place.name));
            place.marker.setMap(map);
        });

        $dayButtons.removeClass('current-day');
        $dayButtons.eq(dayNum - 1).addClass('current-day');

        $dayTitle.children('span').text('Day ' + dayNum.toString());

        mapFit();

    };

      // $.ajax({
      //       method: 'GET',
      //       url: '/api/days',
      //       success: function (days) {
      //           days.forEach(function(day){
      //               console.log(days, "dayyyys")
      //               showDays();
      //           })
                
      //           console.log(days,"success!!!!!!!!!!!!");
      //       },
      //        error: function (errorObj) {
      //       // some code to run if the request errors out
      //       }
      //   });


    $addPlaceButton.on('click', function () {

        var $this = $(this);
        var sectionName = $this.parent().attr('id').split('-')[0];
        var $listToAppendTo = $('#' + sectionName + '-list').find('ul');
        var placeName = $this.siblings('select').val();
        var placeObj = getPlaceObject(sectionName, placeName);

        var createdMapMarker = drawLocation(map, placeObj.place[0].location, {
            icon: placeMapIcons[sectionName]
        });

        days[currentDay - 1].push({place: placeObj, marker: createdMapMarker, section: sectionName});
        $listToAppendTo.append(createItineraryItem(placeName));

        mapFit();

        $.ajax({
            method: 'POST',
            url: '/api/days/'+ currentDay +'/' + sectionName,
            data: {type: sectionName, placeName: placeName},
            success: function (responseData) {
                console.log("inside adding success")
        // some code to run when the response comes back
            },
            error: function (errorObj) {
                console.log("error is here???")
        // some code to run if the request errors out
            }
            });

        // $.post('/api/days/' + currentDay +'/' + sectionName, function(data){
        //     console.log('POST response data', data)
        // }).fail( function (err) {console.error('err', err)} );

        

    });

    $placeLists.on('click', '.remove', function (e) {
        
        var $this = $(this);
        var $listItem = $this.parent().parent();
        var nameOfPlace = $this.siblings('span').text();
        var indexOfThisPlaceInDay = getIndexOfPlace(nameOfPlace, days[currentDay - 1]);
        var placeInDay = days[currentDay - 1][indexOfThisPlaceInDay];
        var sectionName = ($listItem.parent().parent().attr('id').split('-')[0]);
            

        placeInDay.marker.setMap(null);
        days[currentDay - 1].splice(indexOfThisPlaceInDay, 1);
        $listItem.remove();

        $.ajax({
            method: 'DELETE',
            url: '/api/days/'+ currentDay +'/' + sectionName,
            data: {type: sectionName, placeName: nameOfPlace},
            success: function (responseData) {
                console.log("inside delete success")
        // some code to run when the response comes back
            },
            error: function (errorObj) {
                console.log("we got an error here")
        // some code to run if the request errors out
            }
            });

    });

    $dayButtons.on('click', '.day-btn', function () {
        var dayNum = $(this).index() + 1;
        setDay($(this).index() + 1);
        //OUr very first ajax call
        $.get('/api/days/dayNum', function (data) {console.log('GET response data LOLOLOLOLO', data)})
            .fail( function (err) {console.error('err', err)} );

         // $.get('/api/days/', function (data) {console.log('GET response data', data)})
         //    .fail( function (err) {console.error('err', err)} );
    });

    $addDayButton.on('click', function () {

        var currentNumOfDays = days.length;
        var $newDayButton = createDayButton(currentNumOfDays + 1);

        $addDayButton.before($newDayButton);
        days.push([]);
        setDayButtons();
        setDay(currentNumOfDays + 1);

        $.ajax({
            method: 'POST',
            url: '/api/days/',
            data: {dayNum: ++currentNumOfDays},
            success: function (responseData) {
                console.log("success")
            },
             error: function (errorObj) {
            // some code to run if the request errors out
        }
    });

          

    });

    $dayTitle.children('button').on('click', function () {

        removeDay(currentDay);

    });

    // function createDayInDb(dayNum, cb) {
    //     //add new day to mongo:
               
    //     $.ajax({
    //         method: "POST",
    //         url: '/api/days/',
    //         data: {number: dayNum},
    //         success: cb,
    //         error: function (err) {
    //             console.log(err);
    //         }
    //     }); 
    // }

});

