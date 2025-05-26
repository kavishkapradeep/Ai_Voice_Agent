import React, { useState } from 'react'
import {
  Dialog,

  DialogClose,

  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { CoachingExpert } from '@/services/Option'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

function UserinputDialog({children,coachingOption }) {
  const [selectedExpert,setSelectedExpert] = useState('')
  const [topic,setTopic] = useState('')
  const [loading,setLoading] = useState(false)
  const [openDialog,setOpenDialog] = useState(false)
  const router = useRouter();
  const createDiscussionRoom =useMutation(api.DiscussionRoom.CreateNewRoom)
  const OnClickNext = async () => {
    setLoading(true)
    const result = await createDiscussionRoom({
        topic:topic,
        coachingOption:coachingOption?.name,
        expertName:selectedExpert
    })
    console.log(result);
    setLoading(false)
    setOpenDialog(false)
    router.push(`/discussion-room/`+result  ) // Redirect to the discussion room
  }
    return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogTrigger>{children}</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{coachingOption.name}</DialogTitle>
      <DialogDescription asChild>
        <div className=' mt-3'>
            <h2 className=' text-black'>Enter a topic to master your skills in {coachingOption.name}</h2>
            <Textarea  className='mt-2' placeholder='Enter yourtopic here...' onChange={(e)=>setTopic(e.target.value)} value={topic}/>
                        <h2 className=' text-black'>Select Expert You Want...</h2>
            <div className=' grid grid-cols-3 md:grid-cols-5 gap-6 mt-3'>
                {CoachingExpert.map((expert,index)=>(
                    <div key={index} onClick={()=>setSelectedExpert(expert.name)}
                    >
                    <Image  src={expert.avatar} alt={expert.name}
                    width={100} height={100} className={`${selectedExpert === expert.name && 'border-2 border-primary'} cursor-pointer rounded-2xl h-[80px] w-[80px] object-cover
                    hover:scale-105 p-1 transitionn-all`}></Image>
                    <h2 className=' text-center'>{expert.name}</h2>
                    </div>
                ))

                }
            </div>
            <div className='flex gap-5 justify-end mt-5'>
                <DialogClose  asChild>
                    <Button variant={'ghost'}>Cancel</Button>
               </DialogClose>
                <Button disabled={(!topic || !selectedExpert)} onClick={OnClickNext} >
                    {loading && <LoaderCircle className=' animate-spin'/>}Next</Button>
            </div>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

  )
}

export default UserinputDialog