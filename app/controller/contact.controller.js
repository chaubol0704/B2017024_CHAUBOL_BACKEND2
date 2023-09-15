const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util")
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
        // console.log(req.body)
        const contactService = new ContactService(MongoDB.client);
        // console.log(contactService)
        const document = await contactService.create(req.body);
        // console.log(contactService)
        return res.send(document)
    } catch (error) {
        return next(new ApiError(500, `An error has occurred while creating new contact with error '${error}'`))
    }
}

// exports.delete = (req, res) => {
//     res.send({ message: "delete handler" })
// }
exports.deleteAll = (req, res) => {
    res.send({ message: "deleteAll handler" })
}
// exports.findAllFavorite = (req, res) => {
//     res.send({ message: "findAllFavorite handler" })
// }
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        console.log(req.params.id)
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, `An error has occurred while retrieving contacts with error '${error}'`))
    }
    return res.send(documents)
}
exports.findOne = async (req, res, next) => {
    try {
        console.log(req.params)
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        console.log(document)
        return res.send(document)
    } catch (error) {
        return next(new ApiError(500, `An error has occurred while retrieving contact with ID = ${req.params.id}`))
    }
}
exports.update = async (req, res, next) => {
    // console.log(Object.keys(req.body))
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        // console.log(req.params.id)
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        console.log(document)
        if (!document) {
            return next(new ApiError(404, "Contact to update not found"));
        } else {
            return res.send({ message: "Contact has been updated successfully" });
        }
    } catch (error) {
        return next(new ApiError(500, `An error has occurred while updating contact with ID = ${req.params.id}`))
    }
}
exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact to delete not found"));
        } else {
            return res.send({ message: "Contact has been deleted successfully" });
        }
    } catch (error) {
        return next(new ApiError(500, `An error has occurred while deleting contact with ID = ${req.params.id}`))
    }
}
exports.deleteAll = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.deleteAll();
        return res.send({ message: "All contact have been deleted successfully" });
    } catch (error) {
        return next(new ApiError(500, `An error has occurred while deleting contact with ID = ${req.params.id}`))
    }
}
exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite();
        return res.send(documents)

    } catch (error) {
        return next(new ApiError(500, `An error has occurred while retrieving favorite contacts`))
    }
}