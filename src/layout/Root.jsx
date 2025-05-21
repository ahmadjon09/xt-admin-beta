import React from 'react'
import { Outlet } from 'react-router-dom'
import { Nav } from '../components/Nav'

export const Root = () => {
  return (
    <>
      <Nav />
      <main className='mt-[50px]'>
        <Outlet />
      </main>
    </>
  )
}
