import mongoose from 'mongoose';



let dbConnect = async () => {
    try {

        mongoose.connect("mongodb+srv://zajampratik:yk80oZfkaJEMXYTL@cluster0.4hcrmch.mongodb.net/whistleSpace?retryWrites=true&w=majority&appName=Cluster0")

       
    } catch (error) {
        console.log(error.message)
    }

}


export default dbConnect