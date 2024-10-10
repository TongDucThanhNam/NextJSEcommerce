import { Button, cn, Tooltip } from "@nextui-org/react";
import React, { forwardRef, memo, useMemo } from "react";
import {
  SolarCheckReadLinear,
  SolarCopyLinear,
} from "@/components/icons/icons";

export interface CopyTextProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  textClassName?: string;
  copyText?: string;
  children: string;
}

export const CopyText = memo(
  forwardRef<HTMLDivElement, CopyTextProps>((props, forwardedRef) => {
    const { className, textClassName, children, copyText = "Copy" } = props;
    const [copied, setCopied] = React.useState(false);
    const [copyTimeout, setCopyTimeout] = React.useState<ReturnType<
      typeof setTimeout
    > | null>(null);
    const onClearTimeout = () => {
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
    };

    const handleClick = () => {
      onClearTimeout();
      navigator.clipboard.writeText(children);
      setCopied(true);

      setCopyTimeout(
        setTimeout(() => {
          setCopied(false);
        }, 3000),
      );
    };

    const content = useMemo(
      () => (copied ? "Copied" : copyText),
      [copied, copyText],
    );

    return (
      <div
        ref={forwardedRef}
        className={cn("flex items-center gap-3 text-default-500", className)}
      >
        <span className={textClassName}>{children}</span>
        <Tooltip className="text-foreground" content={content}>
          <Button
            isIconOnly
            className="h-7 w-7 min-w-7 text-default-400"
            size="sm"
            variant="light"
            onPress={handleClick}
          >
            {!copied && <SolarCopyLinear />}
            {copied && <SolarCheckReadLinear />}
          </Button>
        </Tooltip>
      </div>
    );
  }),
);

CopyText.displayName = "CopyText";
