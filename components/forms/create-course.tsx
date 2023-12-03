'use client';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { postCourse } from '@/lib/db/post-course';

const formSchema = z.object({
	title: z.string().min(2, {
		message: 'Title must be at least 2 characters.'
	}),
	description: z.string().min(2, {
		message: 'description must be at least 2 characters.'
	})
});

export function CreateCourseForm({ userId }: { userId: string }) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: ''
		}
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
		await postCourse({
			course: values,
			userId
		});
		console.log('posted course');
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					name="title"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Course Name</FormLabel>
							<FormControl>
								<Input placeholder="Input the course name" {...field} />
							</FormControl>
							<FormDescription>This is the name of the course.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="description"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Course Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Input a long description for the course"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This is the description that shows up on the menu.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}