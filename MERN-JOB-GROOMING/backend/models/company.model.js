const mongoose =require('mongoose');
const companySchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    }, 
    description:{
        type:String,
        required:true
    },
    website:{
        type:String,   
    },
    location:{
        type:String,
        required:true,
    },
    logo:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    applications:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Application',
         
        }
    ]

},{ timestamps:true}
)

export const Company= mongoose.model("Company",companySchema);