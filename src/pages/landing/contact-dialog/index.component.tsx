import { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Contact Dialog
 * Component in charge of providing ways to contact the author of Balancer.
 */
const ContactDialog = memo(
  ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogContent className="sm:max-w-[375px]">
        <DialogHeader>
          <DialogTitle>Contact</DialogTitle>
          <DialogDescription>
            Having issues running the platform? Open a GitHub issue. For other inquiries, email me
            at:
          </DialogDescription>
        </DialogHeader>

        <p className="text-center">jesusgraterol.dev@protonmail.com</p>
      </DialogContent>
    </Dialog>
  ),
);

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default ContactDialog;
