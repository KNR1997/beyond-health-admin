// components/ui/tooth-number-input.tsx
import { forwardRef } from 'react';
import Input from '@/components/ui/input';
import ToothChartViewer from './tooth-chart-viewer';

interface ToothNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  toolTipText?: string;
  onToothSelect?: (value: string) => void;
}

const ToothNumberInput = forwardRef<HTMLInputElement, ToothNumberInputProps>(
  ({ label, error, toolTipText, onToothSelect, value, ...props }, ref) => {
    const handleToothSelect = (toothNumber: string) => {
      if (onToothSelect) {
        onToothSelect(toothNumber);
      }
      // Trigger a change event on the input
      const inputEvent = new Event('change', { bubbles: true });
      const input = ref as React.MutableRefObject<HTMLInputElement>;
      if (input?.current) {
        input.current.value = toothNumber;
        input.current.dispatchEvent(inputEvent);
      }
    };

    return (
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              ref={ref}
              label={label}
              error={error}
              toolTipText={toolTipText}
              value={value}
              {...props}
            />
          </div>
          <div className="mt-6">
            <ToothChartViewer 
              toothNumber={value as string} 
              onToothSelect={handleToothSelect}
            />
          </div>
        </div>
      </div>
    );
  }
);

ToothNumberInput.displayName = 'ToothNumberInput';

export default ToothNumberInput;