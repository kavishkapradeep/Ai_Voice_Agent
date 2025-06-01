import React from 'react'
import ReactMarkDown from 'react-markdown'
function SummeryBox({summery}) {
  return (
    <div className=' h-[60vh] overflow-auto'>
      <div className=' text-base/8' >
        <ReactMarkDown >{summery}</ReactMarkDown>
      </div>
    </div>
  )
}

export default SummeryBox