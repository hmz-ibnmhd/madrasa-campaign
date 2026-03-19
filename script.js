let cropper

function openCrop(){
document.getElementById("cropModal").style.display="flex"
}

function closeCrop(){
document.getElementById("cropModal").style.display="none"
}

document.getElementById("fileInput").addEventListener("change", function(e){

let file = e.target.files[0];

if(file){

let reader = new FileReader();

reader.onload = function(event){
document.getElementById("cropImage").src = event.target.result;
};

reader.readAsDataURL(file);

}

});
const image = document.getElementById("cropImage")

fileInput.addEventListener("change",function(e){

const file = e.target.files[0]
const url = URL.createObjectURL(file)

image.src = url

image.onload=function(){

if(cropper){
cropper.destroy()
}

cropper = new Cropper(image,{
aspectRatio:340/420,
viewMode:2,
autoCropArea:1,
center:true,
background:false,
responsive:true,dragMode:'move',
zoomable:true
});

}

})

let cropBtn = document.getElementById("cropBtn");

document.getElementById("fileInput").onchange = function(e){

let file = e.target.files[0];

if(file){

// button enable
cropBtn.disabled = false;
cropBtn.classList.add("active");

}
image.onload = function(){

cropper = new Cropper(image,{
aspectRatio:338/414,
viewMode:1,
autoCropArea:1
});

// button enable here
cropBtn.disabled = false;
cropBtn.classList.add("active");

};
}


function generatePoster(){

const cropped = cropper.getCroppedCanvas({
width:320,
height:370
})

const photo = new Image()
photo.src = cropped.toDataURL()

const poster = new Image()
poster.src = "poster.png"

poster.onload = function(){

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

canvas.width = poster.width
canvas.height = poster.height

ctx.drawImage(poster,0,0)

let width = 385 
let height = 460

/* CENTER POSITION */

let x = 580
let y = 518



/* ROUNDED FRAME */

let radius = 40

ctx.save()

ctx.beginPath()
ctx.moveTo(x + radius, y)
ctx.lineTo(x + width - radius, y)
ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
ctx.lineTo(x + width, y + height - radius)
ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
ctx.lineTo(x + radius, y + height)
ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
ctx.lineTo(x, y + radius)
ctx.quadraticCurveTo(x, y, x + radius, y)
ctx.closePath()

ctx.clip()

ctx.drawImage(photo, x, y, width, height)

ctx.restore()

// NAME എടുത്ത്
let name = document.getElementById("name").value

if(name.length > 20){
name = name.substring(0,20)
}


// text style
ctx.fillStyle = "#d4a017"
ctx.font = "bold 40px Arial"
ctx.textAlign = "center"


// image-ന്റെ താഴെ name
ctx.fillText(name, x + width/2, y + height + 50)

document.getElementById("resultPoster").src = canvas.toDataURL()

document.querySelector(".container").style.display="none"
document.getElementById("cropModal").style.display="none"
document.getElementById("resultPage").style.display="block"

}

}


function downloadPoster(){
  let link = document.createElement("a");
  link.href = document.getElementById("resultPoster").src;
  link.download = "poster.png";
  link.click();
}

async function shareWhatsApp(){

  let img = document.getElementById("resultPoster");

  if(!img){
    alert("Image not found");
    return;
  }

  try{
    let response = await fetch(img.src);
    let blob = await response.blob();

    let file = new File([blob], "poster.png", { type: "image/png" });

    if(navigator.share){
      await navigator.share({
        files: [file],
        title: "Poster",
        text: "Check this!"
      });
    } else {
      // fallback (WhatsApp text മാത്രം)
      let url = "https://wa.me/?text=" + encodeURIComponent("Check this poster");
      window.open(url, "_blank");
    }

  }catch(e){
    alert("Error sharing image");
  }

}