import * as dotenv from "dotenv";
import { ExtendedClient } from "./structures/Client";
dotenv.config()
export const client = new ExtendedClient()
client.start()