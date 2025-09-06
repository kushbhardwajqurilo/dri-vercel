const {
  sentNotificationToMultipleUsers,
} = require("../../config/expo-push-notification/expoNotification");
const fcmTokenModel = require("../../models/fcmTokenModel");
const NotificationModel = require("../../models/NotificationModel");

// add notification
exports.createNotification = async (userId, title, message, type) => {
  console.log({ userId, title, message, type });
  return await NotificationModel.create({
    userId,
    title,
    message,
    type,
  });
};

// ✅ Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const { user_id } = req; // from auth middleware
    const notifications = await NotificationModel.find({
      userId: user_id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Mark single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req;

    const notification = await NotificationModel.findOneAndUpdate(
      { _id: id, userId: user_id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    const { user_id } = req;
    await NotificationModel.updateMany({ userId: user_id }, { isRead: true });
    res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req;

    const deleted = await NotificationModel.findOneAndDelete({
      _id: id,
      userId: user_id,
    });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendNotificationToAll = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message == "" || message.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "message required" });
    }
    const expo_tokens = await fcmTokenModel.find({});
    const tokens = [];
    expo_tokens.forEach((e) => tokens.push(e.token));
    await sentNotificationToMultipleUsers(tokens, message);
    return res
      .status(200)
      .json({ success: true, message: "notification send" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, error });
  }
};
