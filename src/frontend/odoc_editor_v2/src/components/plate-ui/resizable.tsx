"use client";

import { cn, withRef, withVariants } from "@udecode/cn";
import {
  Resizable as ResizablePrimitive,
  ResizeHandle as ResizeHandlePrimitive,
} from "@udecode/plate-resizable";
import { cva } from "class-variance-authority";

// eslint-disable-next-line react-refresh/only-export-components
export const mediaResizeHandleVariants = cva(
  cn(
    "top-0 flex w-6 select-none flex-col justify-center",
    "after:flex after:h-16 after:w-[3px] after:rounded-[6px] after:bg-ring after:opacity-0 after:content-['_'] group-hover:after:opacity-100"
  ),
  {
    variants: {
      direction: {
        left: "-left-3 -ml-3 pl-3",
        right: "-right-3 -mr-3 items-end pr-3",
      },
    },
  }
);

const resizeHandleVariants = cva(cn("absolute z-40"), {
  variants: {
    direction: {
      left: "h-full cursor-col-resize",
      right: "h-full cursor-col-resize",
      top: "w-full cursor-row-resize",
      bottom: "w-full cursor-row-resize",
    },
  },
});

const ResizeHandleVariants = withVariants(
  ResizeHandlePrimitive,
  resizeHandleVariants,
  ["direction"]
);

export const ResizeHandle = withRef<typeof ResizeHandlePrimitive>(
  (props, ref) => (
    <ResizeHandleVariants
      ref={ref}
      direction={props.options?.direction}
      {...props}
    />
  )
);

const resizableVariants = cva("", {
  variants: {
    align: {
      left: "mr-auto",
      center: "mx-auto",
      right: "ml-auto",
    },
  },
});

export const Resizable = withVariants(ResizablePrimitive, resizableVariants, [
  "align",
]);
