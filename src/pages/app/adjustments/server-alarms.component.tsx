import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { isNumberValid } from 'web-utils-kit';
import { Input } from '@/shared/shadcn/components/ui/input.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/shared/shadcn/components/ui/form.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { ServerService, IAlarmsConfiguration } from '@/shared/backend/server/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import { IFormProps } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Server Alarms Component
 * Component in charge of updating the alarms' configuration.
 */
const ServerAlarms = ({ closeDialog }: IFormProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
  const { data, loading, error } = useAPIFetch(
    useMemo(
      () => ({
        fetchFn: () => ServerService.getAlarms(),
      }),
      [],
    ),
  );
  const { setValue, ...form } = useForm<IAlarmsConfiguration>({
    defaultValues: {
      maxCPULoad: data?.maxCPULoad ?? '',
      maxMemoryUsage: data?.maxMemoryUsage ?? '',
      maxFileSystemUsage: data?.maxFileSystemUsage ?? '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);
  const { authority } = useBoundStore((state) => state.user!);

  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  useEffect(() => {
    if (data) {
      setValue('maxCPULoad', data.maxCPULoad);
      setValue('maxMemoryUsage', data.maxMemoryUsage);
      setValue('maxFileSystemUsage', data.maxFileSystemUsage);
    }
  }, [data, setValue]);

  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Triggers whenever the form is submitted and it prompts the user with the confirmation dialog.
   * @param formData
   * @returns void
   */
  const onSubmit = (formData: IAlarmsConfiguration): void => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Update alarms',
      description: 'The new configuration will be applied immediately upon submission',
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await ServerService.updateAlarms(
            {
              maxCPULoad: Number(formData.maxCPULoad),
              maxMemoryUsage: Number(formData.maxMemoryUsage),
              maxFileSystemUsage: Number(formData.maxFileSystemUsage),
            },
            confirmation,
          );
          handleCloseDialog();
        } catch (e) {
          errorToast(e);
          const { message, code } = decodeError(e);
          if (code === 8251) {
            form.setError('maxFileSystemUsage', { message });
          }
          if (code === 8252) {
            form.setError('maxMemoryUsage', { message });
          }
          if (code === 8253) {
            form.setError('maxCPULoad', { message });
          }
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  let content;
  if (error) {
    content = (
      <PageLoadError
        variant="dialog"
        error={error}
      />
    );
  } else if (loading) {
    content = <PageLoader variant="dialog" />;
  } else {
    content = (
      <Form
        setValue={setValue}
        {...form}
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            control={form.control}
            name="maxCPULoad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max. CPU load%</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="75"
                    {...field}
                    autoComplete="off"
                    disabled={isSubmitting}
                    min={30}
                    max={99}
                  />
                </FormControl>
                <FormDescription>Core processing unit</FormDescription>
                <FormMessage />
              </FormItem>
            )}
            rules={{
              validate: {
                required: (value) =>
                  isNumberValid(Number(value), 30, 99) ? true : 'Enter a number ranging 30% - 99%',
              },
            }}
          />

          <FormField
            control={form.control}
            name="maxMemoryUsage"
            render={({ field }) => (
              <FormItem className="mt-7">
                <FormLabel>Max. memory usage%</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="75"
                    {...field}
                    autoComplete="off"
                    disabled={isSubmitting}
                    min={30}
                    max={99}
                  />
                </FormControl>
                <FormDescription>Random access memory</FormDescription>
                <FormMessage />
              </FormItem>
            )}
            rules={{
              validate: {
                required: (value) =>
                  isNumberValid(Number(value), 30, 99) ? true : 'Enter a number ranging 30% - 99%',
              },
            }}
          />

          <FormField
            control={form.control}
            name="maxFileSystemUsage"
            render={({ field }) => (
              <FormItem className="mt-7">
                <FormLabel>Max. file system usage%</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="80"
                    {...field}
                    autoComplete="off"
                    disabled={isSubmitting}
                    min={30}
                    max={99}
                  />
                </FormControl>
                <FormDescription>Storage device</FormDescription>
                <FormMessage />
              </FormItem>
            )}
            rules={{
              validate: {
                required: (value) =>
                  isNumberValid(Number(value), 30, 99) ? true : 'Enter a number ranging 30% - 99%',
              },
            }}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || authority < 3}
              className="mt-7 w-full"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update
              configuration
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update alarms</DialogTitle>
          <DialogDescription>
            If any of the server's components exceed these values, a notification will be sent
          </DialogDescription>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default ServerAlarms;
