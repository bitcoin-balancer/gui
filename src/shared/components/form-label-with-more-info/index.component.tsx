import { CircleHelp } from 'lucide-react';
import { FormLabel } from '@/shared/shadcn/components/ui/form.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { IComponentProps } from '@/shared/components/form-label-with-more-info/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Form Label With More Info Component
 * Component in charge of exposing a form label that has a dedicated more info dialog.
 */
const FormLabelWithMoreInfo = ({ value, description, ...rest }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const openInfoDialog = useBoundStore((state) => state.openInfoDialog);

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <FormLabel
      className="flex justify-start items-center"
      {...rest}
    >
      {value}
      <span className="flex-1"></span>
      <Tooltip>
        <TooltipTrigger
          className="w-5 h-5"
          type="button"
          aria-label="View more information"
          onClick={() => openInfoDialog({ title: value, content: description })}
          tabIndex={-1}
        >
          <CircleHelp
            className="w-5 h-5"
            aria-hidden="true"
          />
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>More info</p>
        </TooltipContent>
      </Tooltip>
    </FormLabel>
  );
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default FormLabelWithMoreInfo;
