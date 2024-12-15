"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import { useFormContext } from "react-hook-form";

// Import the necessary locales from date-fns
import { enUS, pl } from "date-fns/locale";

interface DatePickerProps {
	fromDate: Date;
	toDate: Date;
}

export function DatePicker({ fromDate, toDate }: DatePickerProps) {
	const [date, setDate] = React.useState<Date>(toDate);

	const t = useTranslations("SignUpForm.Calendar");

	const locale = useLocale();

	const calendarLocale = locale === "pl" ? pl : enUS;

	const months = [
		t("january"),
		t("february"),
		t("march"),
		t("april"),
		t("may"),
		t("june"),
		t("july"),
		t("august"),
		t("september"),
		t("october"),
		t("november"),
		t("december"),
	];

	const years = Array.from(
		{ length: toDate.getFullYear() - fromDate.getFullYear() + 1 },
		(_, i) => fromDate.getFullYear() + i,
	);

	const handleMonthChange = (month: string) => {
		const newDate = setMonth(date, months.indexOf(month));
		setDate(newDate);
	};

	const handleYearChange = (year: string) => {
		const newDate = setYear(date, Number.parseInt(year));
		setDate(newDate);
	};

	const handleSelect = (selectedData: Date | undefined) => {
		if (selectedData) setDate(selectedData);
	};

	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name="dateOfBirth"
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>{t("dobLabel")}</FormLabel>
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant={"outline"}
									className={cn(
										"w-[250px] justify-start text-left font-normal",
										!date && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date ? (
										format(date, "PPP", { locale: calendarLocale })
									) : (
										<span>t("pickDate")</span>
									)}
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<div className="flex justify-between p-2">
								<Select
									onValueChange={handleMonthChange}
									value={months[getMonth(date)]}
								>
									<SelectTrigger className="w-[110px]">
										<SelectValue placeholder="Month" />
									</SelectTrigger>
									<SelectContent>
										{months.map((month) => (
											<SelectItem key={month} value={month}>
												{month}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select
									onValueChange={handleYearChange}
									value={getYear(date).toString()}
								>
									<SelectTrigger className="w-[110px]">
										<SelectValue placeholder="Year" />
									</SelectTrigger>
									<SelectContent>
										{years.map((year) => (
											<SelectItem key={year} value={year.toString()}>
												{year}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<Calendar
								mode="single"
								fromDate={fromDate}
								toDate={toDate}
								selected={date}
								onSelect={(selectedDate) => {
									field.onChange(selectedDate);
									handleSelect(selectedDate);
								}}
								initialFocus
								month={date}
								onMonthChange={setDate}
								locale={calendarLocale} // Pass the locale to the Calendar component
							/>
						</PopoverContent>
					</Popover>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
