import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { isSlugValid, isPasswordValid } from 'web-utils-kit';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Input } from '@/shared/shadcn/components/ui/input.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/shadcn/components/ui/form.tsx';
import { Toaster } from '@/shared/shadcn/components/ui/toaster.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { isAltchaPayloadValid } from '@/shared/backend/validations/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { Altcha } from '@/shared/components/altcha/index.component.tsx';
import { UserService } from '@/shared/backend/auth/user/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import ConfirmationDialog from '@/shared/components/confirmation-dialog/index.component.tsx';
import { IFormInputs } from '@/pages/auth/update-password/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Update Password Component
 * Component in charge of enabling users to set the password once their accounts are created or in
 * case they forget it in the future.
 */
const UpdatePassword = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const navigate = useNavigate();
  const form = useForm<IFormInputs>({
    defaultValues: {
      nickname: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });
  const newPassword = useWatch({ control: form.control, name: 'newPassword' });
  const [altcha, setAltcha] = useState<string | null | undefined>(undefined);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Triggers whenever the form is submitted. Prior to displaying the confirmation dialog, it will
   * validate the altcha solution. If invalid, it will abort the submission.
   * @param data
   * @returns void
   */
  const onSubmit = (data: IFormInputs): void => {
    // ensure the altcha payload was provided
    if (!isAltchaPayloadValid(altcha)) {
      setAltcha(null);
      return;
    }

    // display the confirmation dialog
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Update your password',
      description: 'The new password will be set immediately upon submission',
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await UserService.updatePassword(data.nickname, data.newPassword, confirmation, altcha);
          navigate(NavService.signIn());
        } catch (e) {
          errorToast(e, 'Password Update Error');
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <main className="flex min-h-dvh animate-in fade-in slide-in-from-right duration-500">
      {/* ******
       * FORM *
       ****** */}
      <section className="flex-1 self-center p-5 sm:p-10">
        <article className="w-full sm:w-10/12 md:11/12 lg:w-9/12 xl:w-7/12 2xl:w-6/12 mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <h1 className="text-3xl font-bold text-center">Update your password</h1>
              <p className="text-light text-md text-center">
                Set a password you haven't used elsewhere
              </p>

              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem className="mt-5">
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="nakamoto"
                        {...field}
                        autoComplete="off"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (isSlugValid(value) ? true : 'Enter a valid nickname'),
                  },
                }}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="mt-5">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        autoComplete="off"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) =>
                      isPasswordValid(value)
                        ? true
                        : 'The password must include a minimum of 8 characters and at least one lowercase letter, one uppercase letter, one number, and one special character.',
                  },
                }}
              />

              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem className="mt-5">
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        autoComplete="off"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) =>
                      newPassword === value ? true : 'The passwords don’t match',
                  },
                }}
              />

              <div className={`mt-6 ${isSubmitting ? 'opacity-50' : ''}`}>
                <Altcha onChange={setAltcha} />
                {altcha === null && (
                  <p className="text-error animate-in fade-in duration-500 mt-2 text-sm font-bold">
                    Prove you're not a robot
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                variant="default"
                className="mt-7 w-full"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update password
              </Button>

              <Button
                type="button"
                onClick={() => navigate(NavService.signIn())}
                disabled={isSubmitting}
                variant="outline"
                className="mt-3 w-full"
              >
                Sign in
              </Button>
            </form>
          </Form>
        </article>
      </section>

      {/* *******
       * QUOTE *
       ******* */}
      <aside className="hidden md:block flex-1 bg-primary shadow-8 p-10">
        <article className="flex flex-col h-full items-end">
          <Link to={NavService.landing()}>
            <img
              src="/logo/logo-light.png"
              alt="Balancer Logo"
              width="192"
              height="60"
              className="w-48"
            />
          </Link>

          <span className="my-auto"></span>

          <blockquote className="text-white text-right">
            <p className="text-2xl">
              “We have elected to put our money and faith in a mathematical framework that is free
              of politics and human error.“
            </p>
            <p className="text-sm mt-3">Tyler Winklevoss, co-CEO of Gemini</p>
          </blockquote>
        </article>
      </aside>

      {/* *********************
       * CONFIRMATION DIALOG *
       ******************** */}
      <ConfirmationDialog />

      {/* ********
       * TOASTR *
       ******** */}
      <Toaster />
    </main>
  );
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default UpdatePassword;
