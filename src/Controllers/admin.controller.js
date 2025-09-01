import admin from '../Models/admin.model.js';
import Message from '../Models/message.model.js';
import bcrypt from 'bcryptjs'
import owasp from 'owasp-password-strength-test'
import jwt from 'jsonwebtoken';
import randomBytes from 'random-bytes';


export let signup = async (req, res) => {
    try {
        const { orgName, email, password, confirmPassword } = req.body || {}

        console.log(req.body)

        if (!orgName || !email || !password || !confirmPassword) {
            return res.status(200).json({
                status: false,
                messages: "All Fields Are Required",
                data: null
            })
        }

        if (!password || !confirmPassword) {
            res.status(200).json({
                status: false,
                messages: "password and ConfirmPassword Does Not Match",
                data: null
            })
        }

        let isEmailExists = await admin.findOne({ email: email });
        let isOrgExists = await admin.findOne({ orgName: orgName });



        const result = owasp.test(password);

        if (!result.strong) {
            return res.status(200).json({
                status: false,
                messages: result.errors,
                data: null
            })
        }



        if (isEmailExists) {
            return res.status(200).json({
                status: false,
                messages: "Email Allready exists in the system",
                data: null
            })
        }



        if (isOrgExists) {
            return res.status(200).json({
                status: false,
                messages: "Org Name Allready exists in the system",
                data: null
            })
        }



        const hash = bcrypt.hashSync(password, 10);



        const Admin = new admin({
            orgName: orgName,
            email: email,
            password: hash,
            confirmPassword: confirmPassword,

        });


        try {
            await Admin.save()

            if (Admin._id) {
                return res.status(200).json({
                    status: true,
                    messages: "Admin Added Sucessfully",
                    data: null
                })
            }

        } catch (error) {
            return res.status(200).json({
                status: true,
                messages: error.message,
                data: null
            })
        }

    } catch (error) {
        return res.status(200).json({
            status: false,
            messages: error.message,
            data: null
        })
    }
}


export let login = async (req, res) => {
    try {
        const { email, password } = req.body || {}

        if (!email || !password) {
            return res.status(200).json({
                status: false,
                messages: "All Fields Are Required",
                data: null
            })
        }

        let isemailExists = await admin.findOne({ email: email });


        if (!isemailExists) {
            return res.status(200).json({
                status: false,
                messages: "Account Does Not Exists",
                data: null
            })
        }

        let hashedPassword = isemailExists.password;


        let isPasswordMatch = bcrypt.compareSync(password, hashedPassword);

        if (!isPasswordMatch) {
            return res.status(200).json({
                status: false,
                messages: "Email And Password Does Not Match",
                data: null
            })
        } else {
            var jwtToken = jwt.sign({ id: isemailExists._id, email: isemailExists.email, orgName: isemailExists.email, orgCode: isemailExists.orgCode }, process.env.SECRET_KEY);

            return res.status(200).json({
                status: true,
                message: "Logged In sucessfully",
                data: {
                    token: jwtToken
                }
            })
        }

    } catch (error) {
        return res.status(200).json({
            status: false,
            messages: error.message,
            data: null
        })
    }
}


export let generateCode = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(200).json({
                status: false,
                messages: "is is required",
                data: null
            })
        }

        let bytes = randomBytes.sync(15)
        let code = bytes.toString('base64')

        let saveCode = await admin.updateOne(
            { _id: id },
            { $set: { orgCode: code } }
        )

        if (saveCode) {
            return res.status(200).json({
                status: false,
                messages: "Code is generated Sucessfully",
                data: {
                    code: code
                }
            })
        }



    } catch (error) {
        return res.status(200).json({
            status: false,
            messages: error.message,
            data: null
        })
    }
}




export let getCode = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(200).json({
                status: false,
                messages: "id is required",
                data: null
            })
        }

        let getCodeDetails = await admin.findOne({ _id: id });

        if (!getCodeDetails) {
            return res.status(200).json({
                status: false,
                messages: "Code Not Found",
                data: null
            })
        }

        if (getCodeDetails) {
            return res.status(200).json({
                status: false,
                messages: "Code is fetched Sucessfully",
                data: {
                    code: getCodeDetails.orgCode
                }
            })
        }

    } catch (error) {
        return res.status(200).json({
            status: false,
            messages: error.message,
            data: null
        })
    }
}



export let getMessagesBySecretCode = async (req, res) => {
    try {
        const { secretKey } = req.body

        if (!secretKey) {
            return res.status(200).json({
                status: false,
                messages: "All Fields Are Required",
                data: null
            })
        }

        let fetchMessages = await Message.find({ secretKey: secretKey });

        console.log(fetchMessages)

        if (fetchMessages.length == 0) {
            return res.status(200).json({
                status: false,
                messages: "No Messages Found",
                data: null
            })
        }


        return res.status(200).json({
            status: false,
            messages: "Messages Fetched Sucessfully",
            data: {
                messages: fetchMessages
            }
        })

    } catch (error) {
        return res.status(200).json({
            status: false,
            messages: error.message,
            data: null
        })
    }

}


export let deleteMessageById = async (req, res) => {
    try {
        const { id } = req.body;


        if (!id) {
            return res.status(200).json({
                status: false,
                messages: "No Id Found",
                data: null
            })
        }


        let deleteMessage = await Message.deleteOne({ _id: id });

        if (deleteMessage.deletedCount == 1) {
            return res.status(200).json({
                status: false,
                messages: "Message  Deleted Sucessfully",
                data: null
            })
        } else {
            return res.status(500).json({
                status: false,
                messages: "Something went wrong",
                data: null
            })

        }


    } catch (error) {
        console.log(error.message)
    }
}














