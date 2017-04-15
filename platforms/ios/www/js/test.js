var rating = 0;
var stars = null;
let imageFromFile;
let reviewList = new Array();
let currentReview = 0;
var localStorageKey = "reviewR-maci0182";


document.addEventListener('deviceready', onDeviceReady);


function onDeviceReady() {

    console.log("Ready");


    let saveButton = document.getElementById("saveBtn");
    
    saveButton.addEventListener("click", saveReview);
    console.log("Save Button is clicked " + saveButton);

    let cancelButton = document.getElementById("cancelBtn");

    cancelButton.addEventListener("click", cancelModal);
    console.log("Cancel Button is clicked " + cancelButton);

    let pictureButton = document.getElementById("pictureBtn");

    pictureButton.addEventListener("click", takePicture);
    console.log("Picture Button is clicked " + pictureButton);

    let deleteButton = document.getElementById("deleteBtn");

    deleteButton.addEventListener("click", deleteReview);
    console.log("Delete Button is clicked " + deleteButton);

    setStars();

    displayReviews();


}


function cancelModal() {

    document.getElementById("itemName").value = "";

    value = 0;

    document.getElementById("myImage").src = "";

    setStars();


    var endEvent = new CustomEvent('touchend', {
        bubbles: true,
        cancelable: true
    });

    var a = document.querySelector("a#xButton");

    a.dispatchEvent(endEvent);

}


function saveReview() {

    let itemNameToBeSaved = document.getElementById("itemName").value;

    let ratingToBeSaved = rating;

    imageFromFile = document.getElementById("myImage").src;

    let timeStamp = new Date().getTime() / 1000;


    let review = {
        id: timeStamp,

        name: itemNameToBeSaved,

        rating: ratingToBeSaved,

        img: imageFromFile,

    };


    reviewList.push(review);

    saveToLocalStorage();

    cancelModal();

    displayReviews();

}


function takePicture() {

    var options = {

        quality: 80,

        destinationType: Camera.DestinationType.DATA_URL,

        encodingType: Camera.EncodingType.PNG,

        mediaType: Camera.MediaType.PICTURE,

        pictureSourceType: Camera.PictureSourceType.CAMERA,

        allowEdit: true,

        targetWidth: 300,

        targetHeight: 300

    }

    navigator.camera.getPicture(onSuccess, onFail, options);

}


function displayReviews() {

    getFromLocalSorage();


    let list = document.getElementById("review-list");

    list.innerHTML = "";


    let length = reviewList.length;


    for (let i = 0; i < length; i++) {


        let li = document.createElement("li");

        li.className = "table-view-cell media";

        li.setAttribute("dataId", reviewList[i].id);


        let a = document.createElement("a");

        a.href = "#deleteReview"

        a.classList = "navigate-right";


        let div = document.createElement("div");

        div.classList = "media-body";


        let pName = document.createElement("p");

        pName.className = "name";

        pName.textContent = reviewList[i].name;


        let img = document.createElement("img");

        img.classList = "media-object pull-left";

        img.src = reviewList[i].img;

        img.id = "displayedImage";


        div.appendChild(pName);


        console.log("review list rating");

        console.log(reviewList[i].rating);


        let starLength = reviewList[i].rating;


        for (let n = 0; n < starLength; n++) {

            let spanRating = document.createElement("span");

            spanRating.classList = "star";

            //spanRating.textContent = "&nbsp;";

            div.appendChild(spanRating);

        }


        a.addEventListener("touchstart", openReview);


        a.appendChild(img);

        a.appendChild(div);

        li.appendChild(a);

        list.appendChild(li);

    }

}


function openReview(ev) {


    console.log(ev);

    console.log(ev.target.parentElement.attributes.dataId.nodeValue);

    currentReview = ev.target.parentElement.attributes.dataId.nodeValue;

    console.log(currentReview);


    document.getElementById("closeDeleteMenu").addEventListener("touchstart", function() {

        document.getElementById("itemNameDisplay").textContent = "";

        document.getElementById("reviewImageDisplay").src = "";

        value = 0;

    })



    let length = reviewList.length;

    for (let i = 0; i < length; i++) {

        if (currentReview == reviewList[i].id) {

            document.getElementById("itemNameDisplay").textContent = "Item: " + reviewList[i].name;

            document.getElementById("reviewImageDisplay").src = reviewList[i].img;

            document.getElementById("starsCurrent").innerHTML = "";

            let lengthStars = reviewList[i].rating;

            for (let n = 0; n < lengthStars; n++) {

                let spanRating = document.createElement("span");

                spanRating.classList = "star";

                document.getElementById("starsCurrent").appendChild(spanRating);

            }

            break;

        }

    }

}


function deleteReview() {

    let length = reviewList.length;

    for (let i = 0; i < length; i++) {

        console.log(currentReview);

        console.log(reviewList[i].id);

        if (currentReview == reviewList[i].id) {

            reviewList.splice(i, 1);

            console.log(reviewList);

            break;

        }

    }


    document.getElementById("itemNameDisplay").textContent = "";

    document.getElementById("reviewImageDisplay").src = "";

    document.getElementById("starsCurrent").innerHTML = "";

    value = 0;


    saveToLocalStorage();

    displayReviews();


    var endEvent = new CustomEvent('touchend', {
        bubbles: true,
        cancelable: true
    });

    var a = document.querySelector("#closeDeleteMenu");

    a.dispatchEvent(endEvent);

}


function setStars() {

    stars = document.querySelectorAll('.star');

    addListeners();

    setRating();

}


function onSuccess(imageURI) {

    var image = document.getElementById('myImage');

    image.src = "data:image/jpeg;base64," + imageURI;

}


function onFail(message) {

    console.log('Failed because: ' + message);

}


function addListeners() {

    [].forEach.call(stars, function(star, index) {

        star.addEventListener('click', (function(idx) {

            console.log('adding listener', index);

            return function() {

                rating = idx + 1;

                console.log('Rating is now', rating)

                setRating();

            }

        })(index));

    });


}


function setRating() {

    [].forEach.call(stars, function(star, index) {

        if (rating > index) {

            star.classList.add('rated');

            console.log('added rated on', index);

        } else {

            star.classList.remove('rated');

            console.log('removed rated on', index);

        }

    });

}


function saveToLocalStorage() {

    localStorage.setItem("localStorageKey", JSON.stringify(reviewList));

}


function getFromLocalSorage() {

    if (!localStorage.getItem("localStorageKey")) {

        console.log("No data found");

    } else {

        reviewList = JSON.parse(localStorage.getItem("localStorageKey"));

        console.log("Data retrived from LS");

    }
}