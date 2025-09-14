import User from "../models/user.js";
import fs from "fs";
import WorkoutPlan from "../models/WorkoutPlan.js";
import imagekit from "../configs/imageKit.js";

// Function to change role to owner in Fitpulse
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user; // Get logged-in user ID
    await User.findByIdAndUpdate(_id, { role: "owner" }); // Update role to owner
    res.json({
      success: true,
      message: "You are now an Owner! You can create and manage workout & nutrition plans."
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const addWorkoutPlan = async (req, res) => {
  try {
    const { _id } = req.user; // logged-in owner
    let planData = JSON.parse(req.body.planData); // data sent from frontend
    const imageFile = req.file; // uploaded cover image


    //upload to imagekit
    const fileBuffer = fs.readFileSync(imageFile.path)
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: '/user',
    })

    // optimization through imagekit URL transformation
    var optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [{ "width": "1200" }, { quality: 'auto' }, { format: 'webp' }]//auto compression
    });

    const image = optimizedImageUrl;

    // Create new workout plan
    const newPlan = new WorkoutPlan({
      trainer: _id,
      title: planData.title,
      image: image,
      durationWeeks: planData.durationWeeks,
      category: planData.category,
      difficulty: planData.difficulty,
      equipmentNeeded: planData.equipmentNeeded,
      price: planData.price,
      description: planData.description,
    });

    await newPlan.save();

    res.json({
      success: true,
      message: "Workout Plan added successfully!",
      plan: newPlan,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// 📌 API to update user profile image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user; // logged-in user
    const imageFile = req.file; // file from multer

    if (!imageFile) {
      return res.json({ success: false, message: "No file uploaded" });
    }

    // ⿡ Read uploaded file into memory
    const fileBuffer = fs.readFileSync(imageFile.path);

    // ⿢ Upload to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: '/users', // store inside 'users' folder in ImageKit
    });

    // ⿣ Optimize image with ImageKit transformations
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        {
          width: '400',
          quality: 'auto',
          format: 'webp',
        },
      ],
    });

    // ⿤ Save image URL in DB
    await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });

    // ⿥ Delete temporary file
    fs.unlinkSync(imageFile.path);

    res.json({ success: true, message: "User image updated", image: optimizedImageUrl });

  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
