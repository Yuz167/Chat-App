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
    <form onSubmit={handleSubmit(onSubmit)}>

        <div className='flex flex-col'>
            <label htmlFor='email'>Email</label>
            <input 
                id='email'
                type='email'
                className='bg-gray-400'
                {...register('email', {required:true})}
            />
            {errors.email && <p>Email is required</p>}
        </div>

        <div className='flex flex-col'>
            <label htmlFor='password'>Password</label>
            <input 
                id='password'
                type='password'
                className='bg-gray-400'
                {...register('password', {required:true})}
            />
            {errors.password && <p>Password is required</p>}
        </div>

        <button type='submit'>{isSigningIn? 'Submiting':'Submit'}</button>
        <Link to={'/sign-up'}><button>Go to sign-up</button></Link>
    </form>
  )
}

export default SignIn