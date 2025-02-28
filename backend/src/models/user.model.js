import mongoose from "mongoose"

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    imageId: { type: String }, 
    imageUrl: { 
        type: String,
        validate: {
            validator: function(value) {
                return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    }
});

const User = mongoose.model("User", userSchema)
export default User