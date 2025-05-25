import { UserButton } from '@stackframe/stack'
import Image from 'next/image'
import React from 'react'

function AppHeader() {
  return (
    <div className=' p-3 shadow-sm  flex justify-between items-center'>
        <Image src={'/logo.svg'} width={160} height={200} alt='logo'></Image>
        <UserButton/>
    </div>
  )
}

export default AppHeader