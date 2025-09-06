const { createBanner, getBanner, bannerWithTitle, getBannerWithTitle, deleteBanner, updateBannerWithTitle } = require('../controllers/bannerControll');
const { AuthMiddleWare } = require('../middlewares/adminMiddleware');
const { roleAuthenticaton } = require('../middlewares/roleBaseAuthentication');
const UploadSingleImage = require('../middlewares/singleImageUpload');

const bannerRouter = require('express').Router();

bannerRouter.put('/update',UploadSingleImage.single('image'),updateBannerWithTitle);
bannerRouter.post('/upload',UploadSingleImage.single("image"),createBanner);
bannerRouter.get('/',getBanner);
bannerRouter.post('/bannertext',UploadSingleImage.single("image"),bannerWithTitle);
bannerRouter.get('/all',getBannerWithTitle);
bannerRouter.delete('/delete',deleteBanner)
module.exports = bannerRouter;