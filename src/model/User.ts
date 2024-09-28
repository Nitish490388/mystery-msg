import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string,
    createdaAt: Date
}

const messageSchema: Schema<Message> = new Schema ({
    content: {
        type: String,
        required: true
    },
    createdaAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[]
}

const userSchema: Schema<User> = new Schema ({
    username: {
        type: String,
        required: [true,"username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, 'please use a valid email']
    },
    password: {
        type: String,
        required: [true,"password is required"],
    },
    verifyCode: {
        type: String,
        required: [true,"verifycode is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true,"verifycodeExpiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    message: [
        messageSchema
    ]
});

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || (
    mongoose.model<User>("User", userSchema)
)