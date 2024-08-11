import { WebhookModel as WebhooksModel,WebhookType } from "../../entities/webhooks.entities";
import type { WebhookRepository as InterfaceWebhookRepository} from "..";
import { DefaultMongoDBRepository } from ".";
export class WebhookRepository extends DefaultMongoDBRepository<WebhookType>implements InterfaceWebhookRepository{
    public async create(data: WebhookType): Promise<WebhookType | undefined> {
        const model = new this.WebhookModel(data)
        const createdData = await model.save()
        if(!createdData){
            throw new Error("Could not register Webhook");
        }
        const createdWebhook:WebhookType = createdData.toJSON<WebhookType>()
        return createdWebhook
    }
    public async list(): Promise<WebhookType[]> {
        const webhookList = await this.WebhookModel.find()
        return (webhookList).map(webhook=>{
            const webhooks :WebhookType = webhook.toJSON<WebhookType>();
            return webhooks;
        })
    }
    public async listByName(name:string): Promise<WebhookType[]> {
        const webhookList = await this.WebhookModel.find({name})
        return (webhookList).map(webhook=>{
            const webhooks :WebhookType = webhook.toJSON<WebhookType>();
            return webhooks;
        })
    }
    public async deleteById(id: string): Promise<WebhookType | undefined> {
        const deletedWebhooks = await this.WebhookModel.findOne({id})
        if (!deletedWebhooks){
            return
        }
        await deletedWebhooks.deleteOne()
        return deletedWebhooks.toJSON<WebhookType>()
    }
    public async getById(id: string): Promise<WebhookType | undefined> {
        const webhook = await this.WebhookModel.findOne({id})
        if (!webhook){
            return
        }
        const result :WebhookType = webhook.toJSON<WebhookType>()
        return result
    }
    constructor(private WebhookModel=WebhooksModel){
        super(WebhookModel);
    }
    
}