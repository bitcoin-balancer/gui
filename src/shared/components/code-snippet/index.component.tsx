import classNames from 'classnames';
import { Copy } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { copyToClipboard } from '@/shared/services/utils/index.service.ts';
import { IComponentProps } from '@/shared/components/code-snippet/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * CodeSnippet Component
 * Component in charge of displaying code or command snippets.
 */
const CodeSnippet = ({
  code,
  isCommand,
  canBeCopied,
  className,
}: IComponentProps) => (
  <div
    className={classNames('relative overflow-x-auto p-5 rounded-lg bg-slate-900 text-slate-50 text-sm', className)}
  >
    {
      canBeCopied && (
        <Button
            className='absolute top-2 right-2'
            variant='ghost'
            size='icon'
            onClick={() => copyToClipboard(code)}
            aria-label='Copy to clipboard'
          >
            <Copy className='w-4 h-4' />
        </Button>
      )
    }
    <pre>{`${isCommand ? '$ ' : ''}${code}`}</pre>
  </div>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default CodeSnippet;
