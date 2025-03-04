import React from 'react'
import { Controller, FieldValues, Form, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useMessageStore } from '../store/useMessageStore'

interface formFields {
    username:string,
    email:string,
    password:string,
    imageUrl?:string
}

const SignUp = () => {
  const {useSignUp, authUser} = useAuthStore()
  const {convertFileToBase64} = useMessageStore()
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

  const customInput = ({value, onChange, onBlur, placeholder}:any) => {
    return (
        <div className='flex justify-between items-center'>
            <div className='h-[45px] w-[45px] rounded-md'>
                <img src={value || '/avatar.png'} className='w-full h-full object-cover rounded-md' />
            </div>
            <div>
                <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    multiple className='hidden' 
                    onChange={async(e) => {
                        const files = Array.from(e.target.files || [])
                        if (files && files.length > 0) {
                            try{
                                const avatarImage = await convertFileToBase64(files[0])
                                onChange(avatarImage)
                            }catch(error){
                                console.error("Error converting file:", error)
                            }
                        }
                    }}
                />
                <label htmlFor='avatar-upload' className='cursor-pointer'>
                    <p className='text-sm underline'>Upload an avatar</p>
                </label>
            </div>
        </div>
    )
  }

  return (
    <section className='flex-1 flex justify-center items-center'>
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-52 flex flex-col gap-3'>
            <h1 className='text-nowrap text-2xl mb-5 font-bold bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 text-transparent bg-clip-text'>Create an Account</h1>

            <Controller 
                name='imageUrl'
                control={control}
                render = {({field}) => {
                    return customInput({...field})
                }}
            
            />

            <div className='flex flex-col'>
                <label htmlFor='username' className='text-sm'>Username</label>
                <div className='p-2 bg-[rgba(17,25,40,0.3)] rounded-sm'>
                    <input 
                        id='username'
                        type='text'
                        className='bg-transparent focus:border-none focus:outline-none w-full'
                        {...register('username', {required:true})}
                    />
                </div>
                {errors.username && <p>Username is required</p>}
            </div>

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

            <button type='submit' className='bg-[rgb(51,90,189)] text-xs py-4 rounded-sm'>{isSigningup? 'Signing up':'Sign up'}</button>
        </form>
    </section>
  )
}

export default SignUp