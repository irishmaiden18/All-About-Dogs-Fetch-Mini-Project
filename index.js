//////////////////////////////////////////////////////////////API URL
const DOG_TEXT_URL = "https://dogapi.dog/api/v2/"
const DOG_PIC_URL = "https://dog.ceo/api/breeds/image/random/"

///////////////////////////////////////////////////////////DOM Elements
const loadingIndicator = document.querySelector("#loading-indicator")

const randomDogPicsArea = document.querySelector("#random-dog-pics-area")

const dogFactsList = document.querySelector("#random-dog-facts")
const getNewDogFactsButton = document.querySelector("#get-new-dog-facts")

const breedName = document.querySelector("#breed-name")
const breedDescription = document.querySelector("#breed-description")
const breedLifeSpan = document.querySelector("#breed-life-span")
const breedMaleWeight = document.querySelector("#breed-male-weight")
const breedFemaleWeight = document.querySelector("#breed-female-weight")
const breedHypoallergenic = document.querySelector("#breed-hypoallergenic")

const changeDogBreedArea = document.querySelector("#change-dog-breed-area")
const dogBreedSelect = document.querySelector("#dog-breed-select")

/////////////////////////////////////////////////////////////////Variables
let allDogBreeds = []
let featuredDogBreed
let dogFacts = []
let dogPics = []
let dogPicsLoaded = 0

////////////////////////////////////////////////////////////////Functions

//Initialize Function

//initialize the page
async function initialize() {
    //sets loadingIndicator to true while we get our data
    setLoading(true)
    
    //get dog pics and display along top of screen
    await getDogPics()
    window.addEventListener("resize", () => {
        clearDogPics()
        createDogPics(dogPics)
    })

    //get the array of 5 doc facts
    await getDogFacts()
    //add event listener to clear the fact area and replace them with new dog facts
    getNewDogFactsButton.addEventListener("click", () => {
        clearDogFacts()
        console.log("got called")
        getDogFacts()
    })
    
    //get the array of all dog breeds
    await getAllDogBreeds()
    //select a random dog breed to start with
    featuredDogBreed = getRandomDogBreed(allDogBreeds)
    //populate the featured breed section with the randomly selected breed
    populateFeaturedBreedSection(featuredDogBreed)
    //create an option for the breed select menu for each possible dog breed
    allDogBreeds.forEach(breed => createDogBreedOption(breed))
    //add event listener to handle selecting a new dog breed
    dogBreedSelect.addEventListener("change", handleDogBreedSelection)
    //sets loadingIndcator to false now that we have our data
    setLoading(false)
}

//Dog Pics

//get an array of 10 random dog images from the API
async function getDogPics() {
    const response = await fetch (DOG_PIC_URL + 12)
    const picObj = await response.json()
    // console.log(picObj)
    dogPics = picObj.message
    // console.log(dogPics)

    //create an image tag for each pic in the dogPics array
    createDogPics(dogPics)
}

//create dog images from array
function createDogPics(array) {
    array.forEach(picAddress => createDogPic(picAddress))
}

//create a dog img
function createDogPic(picAddress) {
    const newImg = document.createElement("img")
    newImg.alt = "dog pic"
    newImg.src = picAddress
    newImg.style.height = "100px"
    newImg.style.objectFit = "cover"
    dogPicsLoaded +=1

    if ((window.innerWidth <= 800) && (dogPicsLoaded <= 10)) {
        newImg.style.width = "20%"
    } else if ((window.innerWidth > 800) && (window.innerWidth <= 1220)) {
        newImg.style.width = "15%"
    } else if (dogPicsLoaded <= 10) {
        newImg.style.width = "10%"
    } else {
        return
    }

    randomDogPicsArea.append(newImg)
}

//clear dog pics
function clearDogPics() {
    const toDelete = document.querySelectorAll("#random-dog-pics-area img")
    toDelete.forEach((img) => img.remove())
    dogPicsLoaded = 0
}

//Dog Facts

//get an array of 5 dog facts from the API
async function getDogFacts() {
    const response = await fetch(DOG_TEXT_URL + "facts?limit=5")
    const factObj = await response.json()
    // console.log(factObj)
    dogFacts = factObj.data
    // console.log(dogFacts)

    //populate the list of dog facts with the facts from the dogFacts array
    dogFacts.forEach(fact => createDogFact(fact))
}

//clear the dog facts list
function clearDogFacts() {
    const toDelete = document.querySelectorAll("#random-dog-facts li")
    toDelete.forEach((li) => li.remove())
}

//create a dog fact
function createDogFact(fact) {
    const newLi = document.createElement("li")
    newLi.textContent = fact.attributes.body
    dogFactsList.append(newLi)
}

//Dog Breed

//get an array of all dog breeds in the API
async function getAllDogBreeds() {
    const response = await fetch(DOG_TEXT_URL + "breeds?page[size]=1000")
    const breedObj = await response.json()
    // console.log(breedObj)
    allDogBreeds = breedObj.data
    // console.log(allDogBreeds)
}

//get a random dog breed
function getRandomDogBreed(array) {
    const randomIndex = Math.floor(Math.random() * array.length)
    // console.log(array[randomIndex])
    return array[randomIndex]
}

//populate the featured dog breed section
function populateFeaturedBreedSection(dogBreedObj) {
    const breedAttributes = dogBreedObj.attributes
    breedName.textContent = breedAttributes.name
    breedDescription.textContent = breedAttributes.description
    breedLifeSpan.textContent = `${breedAttributes.life.min} - ${breedAttributes.life.max} years`
    breedMaleWeight.textContent = `${breedAttributes.male_weight.min} - ${breedAttributes.male_weight.max} lbs`
    breedFemaleWeight.textContent = `${breedAttributes.female_weight.min} - ${breedAttributes.female_weight.max} lbs`
    
    if (breedAttributes.hypoallergenic) {
        breedHypoallergenic.textContent = `${breedAttributes.name}s are hypoallergenic`
    } else{
        breedHypoallergenic.textContent = `${breedAttributes.name}s are NOT hypoallergenic`
    }
}

//create option for select menu to represent a dog breed
function createDogBreedOption(dogBreedObj) {
    const newOption = document.createElement("option")
    newOption.value = dogBreedObj.attributes.name
    newOption.textContent = dogBreedObj.attributes.name
    dogBreedSelect.append(newOption)
}

//handle user selecting a new dog breed
function handleDogBreedSelection(event) {
    const dogBreedName = event.target.value
    featuredDogBreed = allDogBreeds.find(dogBreedObj => dogBreedObj.attributes.name == dogBreedName)
    populateFeaturedBreedSection(featuredDogBreed)
}

//sets display of the loading indicator depending on if it's loading
function setLoading(loading) {
    if (loading) {
        loadingIndicator.style.display = "block"
    } else {
        loadingIndicator.style.display = "none"
    }
}


initialize()