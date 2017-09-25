const request = require('request');
const gAuth = require('../DO_NOT_ADD_TO_REPO/googleAuthKeys');
const cheerio = require('cheerio');
const usefulMethods = require('../usefulMethods');
const userDbMethods = require('../userMethods');
const trendingDbMethods = require('../trending/trendingDbMethods');
const recipeDbMethods = require('./recipeDbMethods');



module.exports = {
	search,
	ingredientSearch,
	recipeInfo,
	recipeJoke,
	recipeTrivia,
	tescoSpecials,
	supervaluSpecials,
	storeOffers,
	addToFavourites,
	insert,
    remove,
	getDays,
	getFavourites

}


function search(req, res) {
    const query = req.params.text;
    const userId = req.params.userId;
    var dietString = ""
    var intolerancesString = ""
    userDbMethods.getSettings(userId, (err, settings) => {
        if (err) {
            return res.status(err.error).send(err)
        }
        var dietArray = usefulMethods.grabObjectKeys(settings.cuisine.diet, true)
        var intolerancesArray = usefulMethods.grabObjectKeys(settings.cuisine.intolerances, true)
        if (dietArray.length > 0) {
            dietString = "diet=" 
            for (var i = 0; i < dietArray.length; i++) {
            	dietString = dietString + dietArray[i].replace(" ","+");
            }
        }
        if (intolerancesArray.length > 0) {
            intolerancesString = "intolerances=" 
            for (var i = 0; i < intolerancesArray.length; i++) {
            	intolerancesString = intolerancesString + intolerancesArray[i].replace(" ","+");
            }
        }
        trendingDbMethods.insertSearch(query);
        var options = {
            url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?" + dietString + "instructionsRequired=true&" + intolerancesString + "query=" + query,
            headers: {
                "X-Mashape-Key": "C8Oj3U6HBOmshHSMiF90mElglDOpp1FeV8djsnLZMA19O1pOPy",
                "Accept": "application/json"
                }
        };
        request(options, (err, response, body) => {
            if (err) {
                return res.status(404).send(err)
            }
            return res.status(200).send(JSON.parse(body))
        }); 
    })
}
	
	
function ingredientSearch(req, res) {
    const query = req.params.text;
	var options = {
	url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients=" + query,
	headers: {
		"X-Mashape-Key": "C8Oj3U6HBOmshHSMiF90mElglDOpp1FeV8djsnLZMA19O1pOPy",
		"Accept": "application/json"
		}
	};  
	request(options, (err, response, body) => {
		if (err) {
			return res.status(404).send(err)
        }
        return res.status(200).send({"results":JSON.parse(body)})
    }); 
}


function recipeInfo(req, res) {
    const id = req.params.id;
	var options = {
	url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + id + "/information",
	headers: {
		"X-Mashape-Key": "C8Oj3U6HBOmshHSMiF90mElglDOpp1FeV8djsnLZMA19O1pOPy",
		"Accept": "application/json"
		}
	};  
	request(options, (err, response, body) => {
        if (err) {
            return res.status(404).send(err)
        }
        return res.status(200).send(JSON.parse(body));
    });
}


function recipeJoke(req, res) {
    var options = {
    url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/jokes/random",
    headers: {
        "X-Mashape-Key": "C8Oj3U6HBOmshHSMiF90mElglDOpp1FeV8djsnLZMA19O1pOPy",
        "Accept": "application/json"
        }
    };
    request(options, (err, response, body) => {
        if (err) {
			return res.status(404).send(err)
        }
    	return res.status(200).send(JSON.parse(body));
    });
}


function recipeTrivia(req, res) {
    var options = {
    url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/trivia/random",
    headers: {
        "X-Mashape-Key": "C8Oj3U6HBOmshHSMiF90mElglDOpp1FeV8djsnLZMA19O1pOPy",
        "Accept": "application/json"
        }
    };  
    request(options, (err, response, body) => {
        if (err) {
            return res.status(404).send(err)
        }
        return res.status(200).send(JSON.parse(body));
    });
}


function tescoSpecials(item, cb) {
	const url = 'https://www.tesco.ie/groceries/product/search/default.aspx?searchBox=' + item + '&N=4294964017';
    // The callback function takes 3 parameters, an error, response status code and the html
    request(url, (err, res, html) => {
    // First we'll check to make sure no errors occurred when making the request
        if(err) {
            console.error("Error grabbing Tescos html: " + err);
            return cb({status:404, message : "Issue with grabbing Tescos special offers at the moment, sorry!"});
        }
        var $ = cheerio.load(html, {
                    ignoreWhitespace: true,
                    xmlMode: false,
                    decodeEntities: false,
                    withDomLvl1: false
                });
        var tesco = []
        var promoarray = [];
        $('.promo', '#endFacets-1').each(function(i, elem) {
            if ($(this).text().length > 0) {
                promoarray.push($(this).text());
            }
        });
        var pricearray = [];
        $('.linePrice', '#endFacets-1').each(function(i, elem) {
            if ($(this).text().length > 0) {
                pricearray.push($(this).text());
            }
        });
        var imageUrls = ($.html('.image', '#endFacets-1')).split('"');
        var index = 0
        var j = 3
        $('h3', '#endFacets-1').each(function(i, elem) {
            var current = $(this).text()
            if (current.length > 0) {
                var newItem = { 
                	"category": item,
                    "name" : current,
                    "price": pricearray[index],
                    "special offer": promoarray[index],
                    "img": imageUrls[j]
                }
                tesco.push(newItem);
                index++;
                j = j + 6
            }
        });
        return cb({status:200,payload:[tesco,item]});
    })  
}
	

function supervaluSpecials(item, cb) {
    var url = 'https://shop.supervalu.ie/shopping/search/allaisles?q=' + item;
    request(url, (err, res, html) => {
        // First we'll check to make sure no errors occurred when making the request
        if(err){
            console.error("Error grabbing SuperValu's html: " + err);
            cb({status:404, message : "Issue with grabbing Supervalu's special offers at the moment, sorry!"});
        }
        else {
            var $ = cheerio.load(html, {
                        ignoreWhitespace: true,
                        xmlMode: false,
                        decodeEntities: false,
                        withDomLvl1: false
                    });
            var supervalu = [];
            // FOR EACH PRODUCT IN THE HTML - 
            $('.col-xs-6.col-sm-4.col-md-2-4.ga-impression.ga-product', '#search-all-aisles-listings-view').each(function(i, elem) {
                // IF THE SELECTED PRODUCT HAS A PROMOTION -
                if (($(this).find('.product-list-item-promotion-badge')).text()) {
                    // GO TO THE SELECTED CHILD CLASS, GRAB THE HTML FROM IT, AND PULL OUT THE URL FOR THE IMAGE
                    var imageUrl = ($(this).find('.product-list-item-display').html()).split('"')[17];
                    // MAKE A NEW OBJECT BASED ON THE DETAILS FROM THIS PRODUCT
                    var newItem = {
                    	"category": item,
                        "name" : ((($(this).find('.product-list-item-details-title')).text()).replace(/&#39;/g,"'")).replace(/&amp;/g,"&"),
                        "price": (($(this).find('.product-details-price-item')).text()).replace(/\s/g,''),
                        "special offer": ($(this).find('.product-list-item-promotion-badge')).text(),
                        "img": imageUrl
                    }
                    supervalu.push(newItem);
                }
            });
            cb({status:200,payload:[supervalu,item]});
        }
    })
}	


//////////


function storeOffers() {
    trendingDbMethods.getTrendingSearches((err,popularItems) => {
        for (item in popularItems) {
            tescoSpecials(popularItems[item], specialOffers => {
                trendingDbMethods.insertSpecial("tesco",specialOffers.payload[0]);
            });
            supervaluSpecials(popularItems[item], specialOffers => {
                trendingDbMethods.insertSpecial("supervalu",specialOffers.payload[0]);
            });
        }
	})
}


function addToFavourites(req, res) {
    var userId = req.body['userId'];
    var item = req.body['item'];
    recipeDbMethods.insertFavourite(userId, item);
    trendingDbMethods.insertMeal(item.title)
    return res.status(200).send({status:200});
}


function insert(req, res) {
    var userId = req.body['userId'];
    var day = req.body['day'];
    var meal = req.body['meal'];
    recipeDbMethods.insertMeal(userId, day, meal);
    return res.status(200).send({status:200, message: "Meal successfully added"});
}


function remove(req, res) {
    var userId = req.body.userId;
    var date = req.body.date;
    var meal = req.body.meal;
    console.log(meal)
    recipeDbMethods.removeMeal(userId, date, meal);
    return res.status(200).send({status:200, message: "Meal successfully remove"});
}

function getDays(req, res) {
    var userId = req.params['userId'];
    var day = req.params['day'];
    console.log(userId);
    console.log(day);
    recipeDbMethods.getDay(userId, day, (err, meals) => {
        console.log(meals)
        if (err) {
            return res.status(err.error).send(err);
        }
        return res.status(200).send(meals)
    });
    // res.status(200).send(payload);
}


function getFavourites(req, res) {
    var userId = req.params['userId'];
    recipeDbMethods.getFavourites(userId, (err, favourites) => {
        if (err) {
            return res.status(err.error).send(err);
        }
        return res.status(200).send(favourites);
    });
}
