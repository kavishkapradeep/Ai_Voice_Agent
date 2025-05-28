import axios from "axios"
import OpenAI from "openai";
import { ExpertsList } from "./Option";


export const getToken = async () => {
    const result = await  axios.get('/api/getToken');
     return result.data.token;
}

const openai = new OpenAI({
    baseURL:"https://openrouter.ai/api/v1",
    apiKey:process.env.NEXT_PUBLIC_OPEN_ROUTER_API_KEY,
    dangerouslyAllowBrowser:true
})


export const AIModel = async (topic ,coachingOption,msg) => {

    const option = ExpertsList.find((item)=>item.name == coachingOption)
    const PROMPT = (option.prompt).replace('{user_topic}',topic)

    const completion = await openai.chat.completions.create({
        model:'google/gemma-3-12b-it:free',
        messages:[
            {role:'assistant',content:PROMPT},
            {role:"user" , content:msg}
        ]
    })
    return completion.choices[0].message
}