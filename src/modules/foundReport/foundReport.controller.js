import { foundModel } from "../../../databases/models/foundreport.model.js";
import { deleteOne} from "../../handlers/factor.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchAsyncErr.js";
import cloudnairy from "../../utils/cloudnairy.js";

//addFoundReport
export const addFoundReport = catchError(async (req,res,next)=>{
    if(!req.file){
        return next(new Error("image is required",{cause:400}))
    }
    const {secure_url,public_id}=await cloudnairy.uploader.upload(req.file.path,{folder:`foundReport/${req.user._id}/image`})
    req.body.createdBy=req.user._id
    req.body.image={secure_url,public_id}
    const report=await foundModel.insertMany(req.body)
    return res.status(200).json({message:"done",report,file:req.file})
})


//getAllFoundReports
export const getAllFoundReports = catchError(async (req,res,next)=>{
    let reports =await foundModel.find({createdBy:req.user._id})
    !reports && next (new AppError('Reports not found'))
    reports && res.status(201).json({message: 'success',reports})
    
})



//getOneFoundReport
export const getOneFoundReport = catchError(async (req,res,next)=>{
    let report = await foundModel.findOne({createdBy:req.user._id,_id:req.params.id})
    !report && next (new AppError('Report not found'))
    report && res.status(201).json({message: 'success',report})

})

//updateFoundReport
export const updateFoundReport =catchError(async(req,res,next)=>{
    let report=await foundModel.findOne({createdBy:req.user._id,_id:req.params.id})
    !report && next (new AppError('Report not found'))
    if(req.file){
    const {secure_url,public_id}=await cloudnairy.uploader.upload(req.file.path,{folder:`foundReport/${req.user._id}/image`})
    req.body.image={secure_url,public_id}
    }
    const newReport=await foundModel.findOneAndUpdate({createdBy:req.user._id,_id:req.params.id} ,req.body,{new:true})
    console.log(report)
    return res.status(200).json({message:"done",newReport,file:req.file})
})




//deleteFoundReport
export const deleteFoundReport = deleteOne(foundModel,'report')

