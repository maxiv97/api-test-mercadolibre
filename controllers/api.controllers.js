const fetch = require('node-fetch');

const basePath = 'https://api.mercadolibre.com/';
const endpoints = {
    "getItems": `${basePath}sites/MLA/search?q=:query`,
    "getItem": `${basePath}items/:id`,
    "getItemDescription": `${basePath}items/:id/description`
};

const getItems = (request, response) => {
    const query = request.query.q;
    const urlGetItems = endpoints.getItems.replace(':query', query)
    getItemsData(urlGetItems)
        .then( data => {
            const author = getAuthor();
            const categories = getCategories(data.filters);
            const items = data.results.splice(0, 4).map( item => getItem(item) );
            const response = {
                "author": author,
                "categories": categories,
                "items": items
            }
            return response;
        })
        .then( data => response.send(data))
        .catch( (error) => console.log(error));
};

const getItemsData = async url => {
    try {
        const res = await fetch(url);
        const json = await res.json();
        return json;
    } catch(error) {
        console.log(error);
    };
};

const getAuthor = () => {
    return {
        "name": "Maximiliano",
        "lastname": "Vergara"
    };
};

const getCategories = (data) => {
    for (let i = 0; i < data.length; i++) {
        const filter = data[i];
        if (filter.id === "category" && filter.values.length > 0) {
            const categories = filter.values[0].path_from_root.map( (value) => {
              return value.name;
            });
            return categories;
        }
    };
};

const getItem = (data) => {
    return {
        "id": data.id,
        "title": data.title,
        "price": {
            "currency": data.currency_id,
            "amount": Math.floor(data.price),
            "decimals": isDecimals(data.price) ? getDecimals(data.price) : 0
        },
        "picture": data.thumbnail,
        "condition": data.condition,
        "free_shipping": data.shipping.free_shipping
    };
};

const isDecimals = (price) => {
    return price.toString().includes('.');
};

const getDecimals = (price) => {
    return parseInt(price.toString().split('.')[1]);
};

const getItemDescription = (request, response) => {
    const id = request.params.id;
    const urlGetItem = endpoints.getItem.replace(':id', id);
    const urlGetItemDescription = endpoints.getItemDescription.replace(':id', id);

    getItemDescriptionData(urlGetItem, urlGetItemDescription)
        .then(data => {
            const author = getAuthor();
            const item = getItem(data.itemData);
            item["sold_quantity"] = data.itemData.sold_quantity;
            item["description"] = data.itemDescriptionData.plain_text;
            const response = {
                "author": author,
                "item": item
            }

            return response;
        })
        .then( data => response.send(data))
        .catch((error) => console.log(error));
};

const getItemDescriptionData = async (urlItem, urlItemDescription) => {
    try {
        const resItem = await fetch(urlItem);
        const resItemDescription = await fetch(urlItemDescription)
        const jsonItem = await resItem.json();
        const jsonItemDescription = await resItemDescription.json();
        const res = {
            "itemData": jsonItem,
            "itemDescriptionData": jsonItemDescription
        }
        return res;
    } catch(error) {
        console.log(error);
    };
};

const apiController = {
    getItems: getItems,
    getItemDescription: getItemDescription
};

module.exports = apiController;