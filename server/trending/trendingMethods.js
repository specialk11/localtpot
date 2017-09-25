const trendingDbMethods = require('./trendingDbMethods')

module.exports = {
    searches,
    meals,
    specials
}

function searches(req, res) {
    trendingDbMethods.getTrendingSearches((err, searches) => {
        if (err) {
            return res.status(err.error).send(err);
        }
        return res.status(200).send(searches)
    })
}


function meals(req, res) {
    trendingDbMethods.getTrendingMeals((err,meals) => {
        if (err) {
            return res.status(err.error).send(err);
        }
        return res.status(200).send(meals)
    })
}


function specials(req, res) {
    trendingDbMethods.getSpecials((err, specials) => {
        if (err) {
            res.status(err.error).send(err);
        }
        else {
            res.status(200).send(specials);

        }
    })
}