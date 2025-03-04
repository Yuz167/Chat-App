import React from 'react'
import List from './list/List'
import Chat from './Chat'
import Detail from './Detail'
import { Outlet, useParams } from 'react-router-dom'
import WelcomePage from './WelcomePage'

const Home = () => {
  const { id } = useParams()
  return (
    <>
        <List />
        {id? 
            <>
                <Outlet />
                <Detail />
            </>
        :
            <WelcomePage />
        }
    </>
  )
}

export default Home