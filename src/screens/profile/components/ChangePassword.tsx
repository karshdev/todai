import { TodaiAnimatedButton } from '@/components/button/TodaiAnimatedButton';
import TodaiDialog from '@/components/dialog/TodaiDialog';
import TodaiInput from '@/components/TodaiInput';
import { useModal } from '@/hooks/useModal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ChangePasswordInputs, ChangePasswordSchema, ErrorMessage } from '../types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { error } from 'console';
import { changePassword } from '@/lib/axios/api';
import { useToast } from '@/components/ui/use-toast';

function ChangePassword() {
    const { isModalOpen, closeModal } = useModal()
    const { toast } = useToast();


    const { register, setValue, handleSubmit, formState: { errors }, reset } = useForm<ChangePasswordInputs>({ resolver: zodResolver(ChangePasswordSchema) })

    const submitData: SubmitHandler<ChangePasswordInputs> = async (data) => {
        const newData = {
            "old_password": data.old_password,
            "new_password": data.new_password
        }
        const response: any = await changePassword(newData)
        reset();

        if (response?.status === 200) {
            toast({
                title: response?.data?.status,
                description: response?.data?.message,
            });
        }
        else if (response?.response.status === 400) {
            toast({
                variant: 'destructive',
                title: response?.response?.data?.status,
                description: response?.response?.data?.message,
            });
        }
        else {
            toast({
                variant: 'destructive',
                title: 'Failed to change password',
                description: 'Something went wrong, please try again'
            });
        }
        closeModal('changePassword');

    }

    return (
        <TodaiDialog
            open={isModalOpen('changePassword')}
            setOpen={() => closeModal('changePassword')}
            dialogTitle='Change Password'
            content={
                < form className='mt-5 flex flex-col gap-2' onSubmit={handleSubmit(submitData)}>
                    <TodaiInput type='password' label='Current Password' placeholder='Your old password' name='old_password' register={register('old_password')} errorMessage={errors.old_password as ErrorMessage} />
                    <TodaiInput extra='mt-3' label='New Password' type='password' placeholder='Your new password' name='new_password' register={register('new_password')} errorMessage={errors.new_password as ErrorMessage} />
                    <TodaiInput type='password' label='Confirm Password' placeholder='Confirm new password' name='confirm_password' register={register('confirm_password')} errorMessage={errors.confirm_password as ErrorMessage} />
                    < div className='flex items-end mt-5' >
                        <TodaiAnimatedButton variant='primary' type='submit'>Submit</TodaiAnimatedButton>
                    </div >
                </form >
            }
            dialogWidth='100%'
            extraClass='!p-4 h-auto !w-[25%]'

        />
    )
}

export default ChangePassword