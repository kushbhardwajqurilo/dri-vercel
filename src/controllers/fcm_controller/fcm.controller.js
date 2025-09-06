const fcmService = require("../../services/fcmService");

exports.sendToDevice = async (req, res) => {
  try {
    const { token, title, body, data } = req.body;
    if (!token || !title || !body) {
      return res
        .status(400)
        .json({ success: false, message: "token , title and body required" });
    }
    const resp = await fcmService.sendNotificationToDevice(
      token,
      { title, body },
      data || {}
    );
    return res.json({ success: true, messageId: resp });
  } catch (err) {
    console.error("sendToDevice error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.sendToTopic = async (req, res) => {
  try {
    const { topic, title, body, data } = req.body;
    if (!topic || !title || !body) {
      return res.status(400).json({
        success: false,
        message: "topic tile and body required",
      });
    }
    const resp = await fcmService.sendNotificationToTopic(
      top,
      { title, body },
      data || {}
    );
    return req.json({ success: true, messageId: resp });
  } catch (error) {
    console.error("sentToTopic error", err);
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

exports.sendMultiCast = async (req, res) => {
  try {
    const { tokens, title, body, data } = req.body;
    if (!Array.isArray(tokens) || tokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: "tokens requried",
      });
    }
    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: "",
      });
    }
    const resp = await fcmService.sendMultiCast(
      tokens,
      { title, body },
      data || {}
    );
    return res.json({
      success: true,
      resp,
    });
  } catch (err) {
    console.error("sendMulticast error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
