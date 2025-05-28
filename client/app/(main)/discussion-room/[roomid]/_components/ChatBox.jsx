import React from 'react'

function ChatBox({transcript}) {
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
          <p className=" mt-4 text-gray-400 text-sm">
            At the end of your conversation we will automatically generate
            feedback/notes
          </p>
    </div>
  )
}

export default ChatBox