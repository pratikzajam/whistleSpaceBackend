import admin from "../Models/admin.model.js"
import Message from "../Models/message.model.js"



export let verifyCode = async (req, res) => {
    try {
        const { orgCode } = req.body

        if (!orgCode) {
            return res.status(200).json({
                status: false,
                messages: "Orgnization code is required",
                data: null
            })
        }


        let isKeyExists = await admin.findOne({ orgCode: orgCode });

        if (!isKeyExists) {
            return res.status(200).json({
                status: false,
                messages: "Orgnization code does not exists",
                data: null
            })
        }

        function generateRandomUsername() {
            const adjectives = [
                'Brave', 'Quick', 'Silly', 'Lazy', 'Happy', 'Clever', 'Calm', 'Witty', 'Loyal', 'Shy',
                'Bold', 'Gentle', 'Fierce', 'Smart', 'Kind', 'Zany', 'Mighty', 'Cheerful', 'Curious', 'Daring',
                'Jolly', 'Nimble', 'Quiet', 'Spunky', 'Grumpy', 'Charming', 'Quirky', 'Savvy', 'Bubbly', 'Dizzy'
            ];

            const animals = [
                'Tiger', 'Panda', 'Eagle', 'Shark', 'Fox', 'Wolf', 'Koala', 'Lion', 'Bear', 'Otter',
                'Cheetah', 'Penguin', 'Falcon', 'Lynx', 'Jaguar', 'Hawk', 'Rabbit', 'Owl', 'Camel', 'Deer',
                'Moose', 'Gecko', 'Buffalo', 'Sloth', 'Llama', 'Raccoon', 'Gorilla', 'Toucan', 'Walrus', 'Badger'
            ];

            const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
            const randomNum = Math.floor(1000 + Math.random() * 9000);

            return `${randomAdj}${randomAnimal}${randomNum}`;
        }



        return res.status(200).json({
            status: true,
            messages: "key verified Sucessfully",
            data: {
                orgCode: orgCode,
                companyName: isKeyExists.orgName,
                userName: generateRandomUsername()
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




export let addMessage = async (req, res) => {
    try {
        const { secretKey, content, randomUsername } = req.body


        console.log(req.body)

        if (!secretKey || !content || !randomUsername) {
            return res.status(200).json({
                status: false,
                messages: "All Fields Are Required",
                data: null
            })
        }



        let message = new Message({
            secretKey: secretKey,
            content: content,
            randomUsername: randomUsername
        })

        await message.save();

        if (message._id) {
            return res.status(200).json({
                status: false,
                messages: "Message Added Sucessfully",
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

        let fetchMessages = await Message
            .find({ secretKey: secretKey })
            .select('-__v')
            .sort({ createdAt: -1 });

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