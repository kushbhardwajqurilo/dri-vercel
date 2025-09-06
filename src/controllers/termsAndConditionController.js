const termsAndConditonModel = require("../models/termsAndConditonModel");

exports.addTNC = async (req, res, next) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400)
                .json({ success: false, message: "content missing" });
        }
        const insert = await termsAndConditonModel.create({ content });
        if (!insert) {
            return res.status(200)
                .json({ success: false, message: "Failed to add TNC" });
        }
        return res.status(201)
            .json({
                success: true,
                message: "TNC added successfully",
            })
    } catch (err) {
        return res.status(500)
            .json({
                success: false,
                message: err.message,
                error: err
            })
    }
}


exports.updateTnc = async (req, res, next) => {
    try {

        const { id } = req.query;
        const { content } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "id missing" })
        }
        if (!content) {
            return res.status(400).json({ success: false, message: "content missing" })
        }
        const update = await termsAndConditonModel.findByIdAndUpdate(id, { content }, { new: true })
        if (!update) {
            return res.status(200)
                .json({ success: false, message: "Failed to update TNC" })
        }
        return res.status(201)
            .json({ success: true, message: "TNC updated successfully" })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message,
                error
            })
    }
}

//delete tnc

exports.deleteTnc = async (req, res, next) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ success: false, message: "id missing" })
        }
        const deleteTnc = await termsAndConditonModel.findByIdAndDelete(id)
        if (!deleteTnc) {
            return res.status(200)
                .json({ success: false, message: "Failed to delete TNC" })
        }
        return res.status(200)
        .json({ success: true, message: "TNC deleted successfully" })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message,
                error
            })
    }
}
// get all tnc 
exports.getAllTnc = async (req , res, next) => {
    try{
        const tnc = await termsAndConditonModel.find();
        if(!tnc){
            return res.status(200)
            .json({ success: false, message: "No TNC found" })
            }
            return res.status(200)
            .json({ success: true, data:tnc})
    }catch(err){
        return res.status(500)
        .json({
            success: false,
            message: err.message,
            error:err
            })
    }
}