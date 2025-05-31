import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { AIModelToGeneratedFeedbackAndNotes } from '@/services/GlobalServices'
import { useMutation } from 'convex/react'
import { LoaderCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

function ChatBox({transcript,enableFeedback,coachingOption}) {
  const [loading,setLoading] = useState(false)
  const UpdateSumery = useMutation(api.DiscussionRoom.UpdateSumery )
const {roomid} = useParams()
  const GenerateFeedbackNotes =async ()=>{
    setLoading(true)
    try {
    const result = await AIModelToGeneratedFeedbackAndNotes(
      coachingOption,transcript
    );
    console.log(result.content);
    await  UpdateSumery({
      id:roomid,
      summery:result.content
    })
    toast('Feedback/Notes Saved!')
    } catch (error) {
      console.log(error);
      toast('Feedback error')
    }
setLoading(false)
  }

  return (
    <div>
         <div className="  relative h-[60vh] bg-secondary border rounded-4xl flex flex-col p-4 overflow-auto  text-sm scrollbar-hide  ">

            {transcript.map((item,index)=>(
                <div key={index} className={`flex ${item.role == 'user' && 'justify-end'}`}>{
                    item.role == 'assistant' ?
                    <h2 className=' p-1 px-2 bg-primary text-white inline-block rounded-md my-2'>{item?.content}</h2>:
                    <h2 className=' p-1 px-2 bg-gray-300 inline-block rounded-md'>{item?.content}</h2>}
                </div>
            ))}

          </div>
         {!enableFeedback? <p className=" mt-4 text-gray-400 text-sm">
            At the end of your conversation we will automatically generate
            feedback/notes
          </p>: <Button onClick={GenerateFeedbackNotes} className='mt-7 w-full ' disabled={loading}>
            {loading && <LoaderCircle className=' animate-spin '/>}
            Generate Feedback /Notes</Button>}
    </div>
  )
}

export default ChatBox