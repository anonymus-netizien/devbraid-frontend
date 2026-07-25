import { OTPInput } from 'input-otp';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, maxLength = 6, disabled = false }: OtpInputProps) {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      disabled={disabled}
      render={({ slots }) => (
        <div className="flex gap-2 justify-center">
          {slots.map((slot, i) => (
            <Slot key={i} {...slot} />
          ))}
        </div>
      )}
    />
  );
}

function Slot(props: React.HTMLAttributes<HTMLDivElement> & { char?: string | null; hasFakeCaret?: boolean; isActive?: boolean }) {
  const { char, hasFakeCaret, isActive } = props;

  return (
    <div
      className={cn(
        'relative flex h-12 w-10 items-center justify-center rounded-md border text-lg font-mono transition-all',
        isActive && 'border-primary ring-2 ring-primary/20',
        !isActive && 'border-hairline',
        char && 'border-primary/60'
      )}
    >
      {char && <span>{char}</span>}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-foreground" />
        </div>
      )}
    </div>
  );
}
