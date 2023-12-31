import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

export interface User {
	uuid: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
}

interface Course {
	uuid: string;
	title: string;
	description: string;
	authorId: string;
	author: User;
	createdAt: Date;
	updatedAt: Date;
	published: boolean;
}

export async function listCoursesRequest() {
	const request = new NextRequest(`${process.env.API_URL}/course`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const response = await fetch(request, {
		next: {
			tags: ['get-courses']
		}
	});
	const courses = await response.json();

	return courses;
}

export async function listCourses(params?: { userId: string }) {
	const f = 'listCourses';
	try {
		const prisma = new PrismaClient();

		let courses;
		if (params === undefined) {
			courses = await prisma.course.findMany({
				include: {
					ingredients: true,
					allergens: true
				}
			});
		} else {
			const userId = params.userId;
			courses = await prisma.course.findMany({
				where: {
					authorId: userId
				},
				include: {
					ingredients: true,
					allergens: true
				}
			});
		}

		await prisma.$disconnect();

		return courses;
	} catch (error) {
		console.error(f, error);
		return [];
	}
}
