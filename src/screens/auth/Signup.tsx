'use client'
import OrLine from '@/components/OrLine'
import Image from 'next/image'
import React, { useState } from 'react'
import GoogleIcon from '@/assets/img/google.svg'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ErrorMessage, SignUpSchema, SignUpSchemaType } from './types/signup'
import { zodResolver } from '@hookform/resolvers/zod'
import TodaiInput from '@/components/TodaiInput'
import { TodaiButton } from '@/components/TodaiButton'
import { handleSignUpAction } from './actions'
import { TodaiAlertDialog } from '@/components/TodaiAlertDialog'
import { TodaiImage } from '@/components/TodaiImage'
import TodaiLogo from '@/assets/img/todailogobig.png'
import { signIn } from 'next-auth/react'


function Signup() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) })
    const [showAlert, setShowAlert] = useState(false)
    const [alertTitle, setAlertTitle] = useState('')
    const [alertDescription, setAlertDescription] = useState('')

    const onSubmit: SubmitHandler<SignUpSchemaType> = async data => {
        const response: any = await handleSignUpAction(data)
        if (response.status === 201) {
            //     setLoginDetails({ email: data.email, password: data.password })
            handleLogin(data.email, data.password)
        }
        else {
            setShowAlert(true)
            setAlertDescription(response?.description ?? '')
            setAlertTitle(response?.title ?? '')
        }
    }
    const handleLogin = async (email: string, password: string) => {
        if (email && password) {
            const response = await signIn('credentials', {
                email: email,
                password: password,
                // redirect: false,
            })
        }
    }
    const okCallBack = () => {
        // handleLogin(loginDetails.email, loginDetails.password)
    }

    return (
        <div className='p-8 md:p-18 lg:p-28 flex flex-col justify-center items-center w-full h-full'>
            <TodaiAlertDialog
                open={showAlert}
                setOpen={setShowAlert}
                okCallBack={okCallBack}
                title={alertTitle}
                description={alertDescription}
                buttonTitle="Ok"
            />
            <div className='w-full flex flex-col gap-4 '>
                <TodaiImage src={TodaiLogo} className='self-center h-10 w-44' width={450} height={500} alt='logo' />
                <h2 className='text-4xl font-bold '>{`It's time to use todai. Let's go...`}</h2>
                <h3 className='text-lg font-semibold'>Already a member? <a href="/signin" className='text-blue-500'>Log in.</a></h3>
                <form className='flex flex-col gap-3 mt-2' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex w-full gap-2'>
                        <TodaiInput
                            label='First Name'
                            type="text"
                            placeholder="John"
                            name="firstname"
                            inputMode="text"
                            extra="flex-1"
                            inputClass='!p-6 bg-slate-200'
                            register={register('firstName')}
                            errorMessage={errors.firstName as ErrorMessage}
                        />
                        <TodaiInput
                            label='Last Name'
                            type="text"
                            placeholder="wick"
                            name="Lastname"
                            inputMode="text"
                            extra="flex-1"
                            inputClass='!p-6 bg-slate-200'
                            register={register('lastName')}
                            errorMessage={errors.lastName as ErrorMessage}
                        />
                    </div>
                    <TodaiInput
                        label='Email'
                        type="email"
                        placeholder="johnwick@mail.com"
                        name="email"
                        inputMode="text"
                        extra="flex-1"
                        inputClass='!p-6 bg-slate-200'
                        register={register('email')}
                        errorMessage={errors.email as ErrorMessage}
                    />
                    <TodaiInput
                        label='Password'
                        type="password"
                        placeholder="Password"
                        name="password"
                        inputMode="text"
                        extra="flex-1"
                        inputClass='!p-6 bg-slate-200'
                        register={register('password')}
                        errorMessage={errors.password as ErrorMessage}
                    />
                    {/* <button className='bg-blue-500 p-5 rounded-md text-white'>Sign up your account</button> */}
                    <TodaiButton
                        type="submit"
                        className="relative w-full !py-5 text-center flex justify-center text-white"
                        variant="primary"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                    >
                        Sign up your account
                    </TodaiButton>
                </form>
            </div>
            <OrLine text="or sign up with" />
            <div className='w-full mt-5'>
                <button className='border p-5 w-full rounded-md font-semibold'>
                    <div className='flex gap-3 justify-center items-center' onClick={() => signIn('google', { callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google?type=signup` })}>
                        <Image src={GoogleIcon} alt='authBg' className='h-5 w-5' />
                        <span>  Sign up with Google</span>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default Signup