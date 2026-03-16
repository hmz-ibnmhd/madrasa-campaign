let cropper

function openCrop(){
document.getElementById("cropModal").style.display="flex"
}

function closeCrop(){
document.getElementById("cropModal").style.display="none"
}

const fileInput = document.getElementById("fileInput")
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
aspectRatio:338/414,
viewMode:1
})

}

})


function generatePoster(){

const cropped = cropper.getCroppedCanvas({
width:338,
height:414
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

let width = 382 
let height = 515

/* CENTER POSITION */

let x = 659
let y = 421



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
ctx.fillStyle = "white"
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

let link=document.createElement("a")

link.href=document.getElementById("resultPoster").src
link.download="poster.png"
link.click()

}