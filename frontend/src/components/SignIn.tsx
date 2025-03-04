import React from 'react'
import { FieldValues, Form, SubmitHandler, useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

interface formFields {
    email:string,
    password:string
}

const SignIn = () => {
  const {useLogIn, authUser} = useAuthStore()
  const {mutateAsync:signIn, isPending:isSigningIn} = useLogIn()
  const {register, handleSubmit, formState:{errors}, control} = useForm<formFields>()
  const navigate = useNavigate()


  if(authUser){
    return <Navigate to='/' />
  }

  const onSubmit = async(data: formFields) => {
    try{
        await signIn({...data})
        navigate('/')
    }catch(error){
        console.error("Something went wrong", error);
    }
  }

  return (
    <section className='flex-1 flex justify-center items-center border-r-2 border-white border-opacity-50'>
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-48 flex flex-col gap-3 justify-center'>
            <h1 className='mb-5 font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text'>Welcome back,</h1>

            <div className='flex flex-col'>
                <label htmlFor='email' className='text-sm'>Email</label>
                <div className='p-2 bg-[rgba(17,25,40,0.3)] rounded-sm'>
                    <input 
                        id='email'
                        type='email'
                        className='bg-transparent focus:border-none focus:outline-none w-full'
                        {...register('email', {required:true})}
                    />
                </div>
                {errors.email && <p>Email is required</p>}
            </div>

            <div className='flex flex-col'>
                <label htmlFor='password' className='text-sm'>Password</label>
                <div className='p-2 bg-[rgba(17,25,40,0.3)] rounded-sm'>
                    <input 
                        id='password'
                        type='password'
                        className='bg-transparent focus:border-none focus:outline-none w-full'
                        {...register('password', {required:true})}
                    />
                </div>
                {errors.password && <p>Password is required</p>}
            </div>

            <button type='submit' className='bg-[rgb(51,90,189)] text-xs py-4 rounded-sm'>{isSigningIn? 'Signing in':'Sign in'}</button>
        </form>
    </section>
  )
}

export default SignIn