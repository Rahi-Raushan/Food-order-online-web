import fs from "fs";
import path from "path";
 import foodModel from "../models/foodmodel.js";

// Add Food Item
export const addfood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const food = new foodModel({
      name,
      description,
      price,
      category,
      image: req.file?.filename || "",
    });

    await food.save();
    res.json({ success: true, message: "Food added successfully!" });
  } catch (error) {
    console.error("Error in addfood:", error);
    res.status(500).json({ success: false, message: "Error while adding food" });
  }
};

// List Food Items
export const listfood = async (req, res) => {
  try {
    console.log("Fetching food list...");
    const foods = await foodModel.find();
    console.log("Found foods:", foods.length);
    res.json({ success: true, foods });
  } catch (error) {
    console.error("Error in listfood:", error);
    res.status(500).json({ success: false, message: "Error fetching food list", error: error.message });
  }
};

//  Remove Food Item
export const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found!" });
    }

    const imagePath = path.join("uploads", food.image);

    //  Check if file exists before deleting
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    } else {
      console.warn("Image file not found, skipping deletion:", imagePath);
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed successfully!" });

  } catch (error) {
    console.error("Error in removeFood:", error);
    res.status(500).json({ success: false, message: "Error while removing food" });
  }
};
