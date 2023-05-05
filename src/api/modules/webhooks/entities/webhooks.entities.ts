import mongoose from "mongoose";

export type WebhookType = {
    name:string,
    id:string,
    token:string,
    guildId:string
}
export class Webhook implements WebhookType{
    name:string;
    id:string;
    token:string;
    guildId:string;
    constructor({name, id,guildId,token}:WebhookType){
        this.name = name;
        this.id = id;
        this.token = token;
        this.guildId = guildId;
    }
}
const schema = new mongoose.Schema<WebhookType>({
    name:{type:String,required:true},
    id:{type:String,required:true},
    token:{type:String,required:true},
    guildId:{type:String,required:true}
},
{
    versionKey:false,
    toJSON:{
        transform:(_,ret):void=>{
            delete ret._id;
            delete ret.__v;
        }
    }
}
)
export const WebhookModel = mongoose.model<WebhookType>("webhooks",schema)
