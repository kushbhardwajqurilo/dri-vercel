const { createDRI, updateDri, DeleteDri, getAlldriWorks } = require('../controllers/admin/DriContorller');
const { AuthMiddleWare } = require('../middlewares/adminMiddleware');
const { roleAuthenticaton } = require('../middlewares/roleBaseAuthentication');
const UploadSingleImage = require('../middlewares/singleImageUpload');
const DRIRoutes = require('express').Router();
DRIRoutes.post('/add-dri-works',AuthMiddleWare,UploadSingleImage.single('image'),roleAuthenticaton('admin'),createDRI);
DRIRoutes.put('/update-dri-works',UploadSingleImage.single('image'),updateDri);
DRIRoutes.delete('/delete-dri-works',AuthMiddleWare ,roleAuthenticaton('admin'),DeleteDri);
DRIRoutes.get('/all',getAlldriWorks)
module.exports = DRIRoutes;