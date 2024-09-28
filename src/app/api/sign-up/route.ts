import { sendverificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs";

export async function Post(request: Request) {
    await dbConnect();

    try {
        const {username, email, password} = await request.json();
        const existingUserVerifiedByUser = await UserModel.findOne({
            username,
            isVerified: true
        }); 
        if(existingUserVerifiedByUser) {
            return Response.json({
                success: false,
                message: "Username is already taken",
            }, {
                status: 400
            })
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const existingUserByEmail = await UserModel.findOne({email});
        if(existingUserByEmail) {
            if(existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, {status: 400});
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 36000000);

                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
            });
            await newUser.save();
            // send verification email
            const emailResponse = await sendverificationEmail(
                email,
                username,
                verifyCode
            )

            if(!emailResponse.success) {
                return Response.json({
                    success: false,
                    message: "Username is already taken"
                }, {
                    status: 500
                })
            }

            return Response.json({
                success: true,
                messages: "User registered successfully. Please verify your email"
            }, {status: 201});
        }
    } catch (error) {
        console.error("Error registering error", error);
        return Response.json({
            succcess: false,
            message: "Error registering user"
        },{
            status: 500
        })
    }
}