import React from 'react'
import List from './list/List'
import Chat from './Chat'
import Detail from './Detail'
import { Outlet, useParams } from 'react-router-dom'
import WelcomePage from './WelcomePage'

const Home = () => {
  const { id } = useParams()
  return (
    <div className='text-white w-screen h-screen relative flex justify-center items-center'>
      <img 
        src={'/bg.jpg'}
        className='object-cover h-full w-full absolute -z-10'
      />
      <main className='flex bg-[rgba(17,25,40,0.75)] h-[90vh] w-[90vw] rounded-md backdrop-blur-md backdrop-saturate-150 border-[1px] border-solid border-[rgba(255, 255, 255, 0.125)]'>
        <List />
        {id? 
            <>
                <Outlet />
                <Detail />
            </>
        :
            <WelcomePage />
        }
      </main>
    </div>
  )
}

export default Home