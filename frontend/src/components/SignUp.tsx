import React from 'react'
import { FieldValues, Form, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

interface formFields {
    username:string,
    email:string,
    password:string
}

const SignUp = () => {
  const {useSignUp, authUser} = useAuthStore()
  const {mutateAsync:signUp, isPending:isSigningup, isSuccess} = useSignUp()
  const {register, handleSubmit, formState:{errors}, control} = useForm<formFields>()
  const navigate = useNavigate()

  if(authUser){
    navigate('/')
  }

  const onSubmit = async(data: formFields) => {
    try{
        await signUp({...data})
        navigate('/')
    }catch(error){
        console.error("Something went wrong", error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

        <div className='flex flex-col'>
            <label htmlFor='username'>Username</label>
            <input 
                id='username'
                type='text'
                className='bg-gray-400'
                {...register('username', {required:true})}
            />
            {errors.username && <p>Username is required</p>}
        </div>

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

        <button type='submit'>{isSigningup? 'Submiting':'Submit'}</button>
    </form>
  )
}

export default SignUp