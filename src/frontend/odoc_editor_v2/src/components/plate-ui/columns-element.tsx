import { cn, withRef } from "@udecode/cn";
import { PlateElement } from "@udecode/plate-common";
import { useFocused, useSelected } from "slate-react";

// import "./column.scss";

export const ColumnsElement = withRef<typeof PlateElement>(
  ({ className, ...props }, ref) => {
    const { children } = props;

    const selected = useSelected();
    const focused = useFocused();

    return (
      <PlateElement ref={ref} {...props}>
        <div
          className={cn(
            "columns-wrapper",
            selected && focused && "ring-2 ring-ring ring-offset-2",
            className
          )}
          contentEditable={false}
        >
          <div className="column-block">{children}</div>
          <div className="column-block"></div>
        </div>
      </PlateElement>
    );
  }
);
