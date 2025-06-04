import { UserButton } from '@stackframe/stack'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function AppHeader() {
  return (
    <div className=' p-3 shadow-sm  flex justify-between items-center'>
      <Link href={'/Dashboard'} className=' cursor-pointer'>
        <Image src={'/logo.svg'} width={160} height={200} alt='logo'></Image>
        </Link>
        <UserButton/>
    </div>
  )
}

export default AppHeader