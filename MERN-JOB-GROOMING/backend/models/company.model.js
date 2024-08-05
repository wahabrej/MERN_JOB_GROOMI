const mongoose =require('mongoose');
const companySchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }, 
    description:{
        type:String,
       
    },
    website:{
        type:String,   
    },
    location:{
        type:String,
        
    },
    logo:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
       
    },
    applications:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Application',
            required:true,
        }
    ]

},{ timestamps:true}
)

 const Company= mongoose.model("Company",companySchema);
module.exports = Company;
