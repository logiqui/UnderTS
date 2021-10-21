import { Intents } from "discord.js";
import Under from "./src/Under";

const client = new Under({
  intents: Object.values(Intents.FLAGS),
  restTimeOffset: 0,
  allowedMentions: { parse: ["everyone"] },
});

client.init();
