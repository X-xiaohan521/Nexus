"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { zhCN } from "react-day-picker/locale";

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithRange({ date, setDate }: { date: DateRange | undefined, setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date-picker-range"
                    className="justify-start px-2.5 font-normal"
                >
                    <CalendarIcon />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {format(date.from, "yyyy-MM-dd")} ~{" "}
                                {format(date.to, "yyyy-MM-dd")}
                            </>
                        ) : (
                            format(date.from, "yyyy-MM-dd")
                        )
                    ) : (
                        <span>根据-日期~范围-筛选</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    locale={zhCN}
                />
            </PopoverContent>
        </Popover>
    )
}
