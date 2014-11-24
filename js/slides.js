//if (window.location.protocol === "http:") {
//    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
//} else {

    force.init({
        appId: "3MVG9fMtCkV6eLheIEZplMqWfnDFWubP.RwptOCdBSM76Fp8wY1kgRzZIVQhgZ4dpfN3YzoeeVSPYhMLdz4RH",
        oauthCallbackURL: "https://ccoenraets.github.io/salesforce-mobile-sdk-presentation/oauthcallback.html",
        proxyURL: "https://dev-cors-proxy.herokuapp.com/"
    });

    force.login();

    var _imageData;

    $("body").on("click", ".picture-btn", function () {

        if (!navigator.camera) {
            alert("Camera not supported");
            return;
        }

        var options = {
            quality: 50,
            correctOrientation: true,
            sourceType: Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.DATA_URL
        };

        navigator.camera.getPicture(function (imageData) {
            _imageData = imageData;
            setTimeout(function () {
                $('#audience-pic').attr("src", "data:image/jpeg;base64," + imageData);

            });

        }, function (errorMsg) {
            // Most likely error is user cancelling out
            alert("Error: " + errorMsg);
        }, options);


        return false;

    });

    $("body").on("click", ".chatter-btn", function () {

        var contentVersion = {
            Origin: 'H',            // 'H' for a Chatter File, 'C' for a Content document
            PathOnClient: 'image.png', // Hint as to type of data
            VersionData: _imageData  // Base64 encoded file data
        };

        force.create('ContentVersion', contentVersion,
            function (data) {
                console.log(JSON.stringify(data));
                var fieldList = ['Id', 'ContentDocumentId'];
                force.retrieve('ContentVersion', data.id, fieldList,
                    function (item) {
                        console.log(JSON.stringify(item));
                        var payload =
                        {
                            attachment: {
                                attachmentType: "ExistingContent",
                                contentDocumentId: item.ContentDocumentId
                            },
                            body: {
                                messageSegments: [
                                    {
                                        type: 'Text',
                                        text: 'Great audience at Salesforce1 World Tour New York!'
                                    }
                                ]
                            }
                        };
                        var obj = {
                            path: '/services/data/v29.0/chatter/feeds/record/me/feed-items',
                            method: 'POST',
                            contentType: 'application/json',
                            data: payload
                        };
                        force.request(obj,
                            function () {
                                alert('Posted on chatter');
                            },
                            function (err) {
                                alert('Error Posting to chatter');
                                alert('Error Posting to chatter ' + err);
                                console.log(err);
                            }
                        );

                    },
                    function (err) {
                        console.log(err);
                    });
            },
            function (err) {
                console.log(err);
            });


        return false;

    });


    $("body").on("click", ".dashboard-btn", function () {

        try {
            opportunities.fetch()
                .done(function () {
                    var chart1 = new charts.OpportunitiesByMonth('#chart1', opportunities.groupByMonth(), null, function (point) {
                        var month = point.argument;
                        var filteredOpportunities = opportunities.filterByMonth(month);
                        chart2.update(opportunities.groupByStage(filteredOpportunities), "Stage Breakdown for " + month);
                        chart3.update(opportunities.groupByOwner(filteredOpportunities), "Owner Breakdown for " + month);
                    });
                    var chart2 = new charts.OpportunitiesByStage('#chart2', opportunities.groupByStage(), "Stage Breakdown");
                    var chart3 = new charts.OpportunitiesByOwner('#chart3', opportunities.groupByOwner(), "Owner Breakdown");
                })
                .fail(function (err) {
                    alert(err);
                });
        } catch (e) {
            alert(e);
            console.log(e);
        }
        return false;

    });


    $("body").on("keyup", ".search-key", function (event) {

        if (event.keyCode === 13) { // enter key pressed

            force.query('select id, FirstName, LastName, Title from contact LIMIT 50', function (data) {
                var contacts = data.records;
                var html = '';
                for (var i = 0; i < contacts.length; i++) {
                    var contact = contacts[i];
                    console.log(contact);
                    html += '<li>' + contact.FirstName + ' ' + contact.LastName + ', ' + (contact.Title || '') + '</li>';
                }
                $('#contactList').html(html);
            });

        }
    });

//}