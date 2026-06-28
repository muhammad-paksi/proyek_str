
import { ScrollArea } from '@base-ui/react';

export default function BaseUIScrollWrapper({ 
  children, 
  className 
}: { 
  children?: React.ReactNode, 
  className?: string 
}) {
  return (
    <>
      <ScrollArea.Root className={className}>
        <ScrollArea.Viewport className="w-full h-full">
          {children}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="m-1 flex w-1 justify-center rounded bg-gray-200 opacity-0 transition-opacity pointer-events-none data-hovering:opacity-100 data-hovering:delay-0 data-hovering:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 data-scrolling:pointer-events-auto">
          <ScrollArea.Thumb className="w-full rounded bg-gray-500 opacity-75" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </>
  )
}