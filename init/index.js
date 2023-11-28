const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const murl="mongodb://127.0.0.1:27017/globetotter";

main()
    .then(()=>{
        console.log("connected to the db");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect(murl);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"65461019606685a33915c415",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};
initDB();
