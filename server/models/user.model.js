import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
        },
        email: {
            type: String,
            required: [true, "Please add an email"],
            unique: [true, "Email already exists"],
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
                "Please add a valid email",
            ],
        },

        password: {
            type: String,
            required: [true, "Please add a password"],
            minlength: [8, "Password must be at least 8 characters"],
            match: [
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            ],
            select: false,
        },

        role: {
            type: String,
            enum: ["Buyer", "Admin"],
            default: "Buyer",
        },
    },
    {
        timestamps: true,
    },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User", userSchema);
export default User;
