"use client"

import * as React from "react"

import { ChevronDown } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type TableActionPopoverProps = {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function TableActionPopover({
  children,
  open,
  onOpenChange,
}: TableActionPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50"
        >
          Actions
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={4}
        className="w-48 rounded-lg border border-[#EEEEEE] bg-white p-0 text-gray-900 shadow-lg"
      >
        <div className="py-1">{children}</div>
      </PopoverContent>
    </Popover>
  )
}

export { TableActionPopover }
