const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;
const author = {
    "name": "Maximiliano",
    "lastname": "Vergara"
}

//settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// middlewares
app.get('/api/items', (request, response) => {
    fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${request.query.q}`)
        .then(res => res.json())
        .then(json => {
            let res = {};
            let categories = [];
            let items = [];
            
            json.results.splice(0, 4).map( item => {                
                let newItem = {
                    "id": item.id,
                    "title": item.title,
                    "price": {
                        "currency": item.currency_id,
                        "amount": Math.floor(item.price),
                        "decimals": item.price.toString().includes('.') ? parseInt(item.price.toString().split('.')[1]) : 0
                    },
                    "picture": item.thumbnail,
                    "condition": item.condition,
                    "free_shipping": item.shipping.free_shipping
                }
                items.push(newItem);
            });

            res["author"] = author;
            res["categories"] = categories;
            res["items"] = items;

            response.send(res)});
})

app.listen(port, () => {
    console.log(`API REST running on http://localhost:${port}`);
})
