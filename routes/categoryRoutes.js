const router = require("express").Router();
const { categoryController } = require("../controllers");
const { requireAdmin } = require("../middlewares/auth");

router.post("/", requireAdmin, categoryController.createCategory);

router.get("/", categoryController.getCategoies);

router.patch("/:categoryId", requireAdmin, categoryController.updateCategory);

router.delete("/:categoryId", requireAdmin, categoryController.deleteCategory);

module.exports = router;
