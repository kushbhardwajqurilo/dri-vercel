const adminModel = require("../../models/adminModel");
const subscriptionModel = require("../../models/monthlySubscriptionModel");
const ServiceFeesModel = require("../../models/seriveModel");

exports.createServiceFees = async (req, res, next) => {
  try {
    const { admin_id, role } = req;
    const { fees, dueDate } = req.body;
    if (!admin_id || !role || !fees || !dueDate) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Service Credentials" });
    }

    const isAdminExist = await adminModel.findById(admin_id);
    if (!isAdminExist) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not found" });
    }

    const payload = { adminId: admin_id, fees, dueDate };

    const serviceRes = await ServiceFeesModel.findOneAndUpdate(
      { adminId: admin_id }, // filter
      payload, // update data
      { new: true, upsert: true, setDefaultsOnInsert: true } // options
    );

    return res.status(200).json({
      success: true,
      message: isAdminExist
        ? "Service Updated Successfully"
        : "Service Created Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// update service fees by admin..
exports.updateServiceFees = async (req, res, next) => {
  try {
    const { admin_id, role } = req;
    const { fees, duedate, subId, serviceId, user_id } = req.body;
    if (!admin_id || !role || !fees || !duedate) {
      return res.status(400).json({
        success: false,
        message: "Invalid Service Credentials",
      });
    }
    const isAdminExist = await adminModel.findById(admin_id);
    if (!isAdminExist) {
      return res.status(400).json({
        success: false,
        message: "Admin not found",
      });
    }
    const isSubscription = await subscriptionModel.findById(subId);
    if (!isSubscription) {
      return res
        .status(400)
        .json({ success: false, message: "subscription not found" });
    }
    const isServiceExist = await ServiceFeesModel.findById(serviceId);
    if (!isServiceExist) {
      return res.status(400).json({
        success: false,
        message: "Service not found",
      });
    }
    const payload = {
      userId: user_id,
      fees,
      duedate,
      adminId: admin_id,
    };
    const Update_service = await ServiceFeesModel.updateOne(
      { _id: serviceId },
      payload
    );
    if (!Update_service) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to update service" });
    }
    return res.status(201).json({
      success: true,
      message: "Service Fees Updated Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// delete service fees by admin..
exports.deleteServiceFees = async (req, res, next) => {
  try {
    const { admin_id, role } = req;
    const { subId, serviceId } = req.body;
    if (!admin_id || !role) {
      return res.status(400).json({
        success: false,
        message: "Invalid Service Credentials",
      });
    }
    const isAdminExist = await adminModel.findById(admin_id);
    if (!isAdminExist) {
      return res.status(400).json({
        success: false,
        message: "Admin not found",
      });
    }
    const isSubscription = await subscriptionModel.findById(subId);
    if (!isSubscription) {
      return res
        .status(400)
        .json({ success: false, message: "subscription not found" });
    }
    const isServiceExist = await ServiceFeesModel.findOne({ _id: serviceId });
    if (!isServiceExist) {
      return res.status(400).json({
        success: false,
        message: "Service not found",
      });
    }

    const delete_service = await ServiceFeesModel.deleteOne({ _id: serviceId });
    if (!delete_service) {
      return res
        .status(400)
        .json({ success: false, message: " failed to delete service" });
    }
    return res.status(201).json({
      success: true,
      message: "Service delete Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get all service for user..

exports.getAllServicesToUser = async (req, res, next) => {
  try {
    const services = await ServiceFeesModel.find();
    if (services.length === 0 || !services) {
      return res
        .status(400)
        .json({ success: false, message: "No services found" });
    }
    return res.status(200).json({ success: true, data: services });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getAllServicesToAdmin = async (req, res, next) => {
  try {
    const { admin_id } = req;
    const { user_id } = req.query;
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "User is required" });
    }
    const isAdminExist = await adminModel.findById(admin_id);
    if (!isAdminExist) {
      return res.status(400).json({
        success: false,
        message: "Admin not found",
      });
    }
    const services = await ServiceFeesModel.find({ userId: user_id });
    if (services.length === 0 || !services) {
      return res
        .status(400)
        .json({ success: false, message: "No services found" });
    }
    return res.status(200).json({ success: true, data: services });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
