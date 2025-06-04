import { Button } from '@/components/ui/button'
import { UserButton } from '@stackframe/stack'
import React from 'react'
import WelcomePage from './(main)/WelcomePage'
import AppHeader from './(main)/_components/AppHeader'

export default function Home() {
  return (
    <main className='h-screen w-full  '>
      <AppHeader/>
        <div className=' p-10 mt-20 md:px-20 lg:px-32 xl:px-56 2xl:px-72'>
       <WelcomePage/>
       </div>
    </main>
  )
}
