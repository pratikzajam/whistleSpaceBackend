import mongoose from 'mongoose';



let dbConnect = async () => {
    try {

        mongoose.connect("mongodb://zajampratik:JP1csO7OShdaj2wS@ac-wtv6aj3-shard-00-00.4hcrmch.mongodb.net:27017,ac-wtv6aj3-shard-00-01.4hcrmch.mongodb.net:27017,ac-wtv6aj3-shard-00-02.4hcrmch.mongodb.net:27017/whistleSpace?ssl=true&replicaSet=atlas-p7zlbb-shard-0&authSource=admin&appName=Cluster0")

       
    } catch (error) {
        console.log(error.message)
    }

}


export default dbConnect
