const UrlModel = require('../models/url.model');
const {nanoid} = require('nanoid');

exports.getUrl = async (req, res) => {
    const {slug} = req.params;

    const foundSlug = await UrlModel.findOne({slug});
    
    if (!foundSlug || foundSlug.length == 0) {
        // if slug is not found, return error
        let fullUrl = req.protocol + '://' + req.get('Host') + req.originalUrl;
        res.status(404).json({message: "URL not found.", body: {slug, url: fullUrl}});
    } else {
        // if slug is found, redirect to url
        res.status(302).redirect(foundSlug.url);
    }
}

exports.postUrl = async (req, res) => {
    let {url, slug} = req.body;

    // create slug if not provided
    if (!slug) {
        slug = nanoid(5);
    }
    slug = slug.toLocaleLowerCase();

    // check if slug is unique
    const foundSlug = await UrlModel.find({slug});

    // if slug is unique, create new url
    // if slug is not unique, return error
    if (!foundSlug || foundSlug.length==0) {
        // if url in database, return url
        const foundUrl = await UrlModel.findOne({url});
        if (foundUrl) {
            res.status(200).json({message: "URL already exists.", body: {slug: foundUrl.slug, url: foundUrl.url}});
        } else {
            // create new url
            const newUrl = new UrlModel({url, slug});
            await newUrl.save();
            res.status(200).json({message: "URL created.", body: {slug, url}});
        }
    } else {
        res.status(409).json({message: "Resource already exists.", body:{slug: "", url: ""}});
    }
}