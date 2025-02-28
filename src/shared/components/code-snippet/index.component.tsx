import classNames from 'classnames';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { ClipboardService } from '@/shared/services/clipboard/index.service.ts';
import { IComponentProps } from '@/shared/components/code-snippet/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * CodeSnippet Component
 * Component in charge of displaying code or command snippets.
 */
const CodeSnippet = ({ code, canBeCopied, className }: IComponentProps) => {
  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Copies the code snippet to the clipboard.
   * @returns Promise<void>
   */
  const copyToClipboard = async () => {
    try {
      await ClipboardService.writeText(code);
    } catch (e) {
      errorToast(e, 'Failed to copy to clipboard');
    }
  };





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <div
      className={classNames('overflow-x-auto p-5 rounded-lg bg-slate-900 text-slate-50 text-sm', className)}
    >
      {
        canBeCopied && (
          <div className='absolute top-2 right-2'>
            <Button onClick={copyToClipboard} />
          </div>
        )
      }
      <pre>{code}</pre>
    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default CodeSnippet;
