import { applyDecorators } from '@nestjs/common'
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse
} from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { AvatarDto } from 'src/user/dto/avatar.dto'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UpdateUserDto } from 'src/user/dto/update-user.dto'

export const ApiGetAllUsers = () =>
	applyDecorators(
		ApiOperation({ summary: 'Get all users with pagination' }),
		ApiQuery({
			name: 'page',
			type: Number,
			required: false,
			example: 1,
			description: 'Current page number'
		}),
		ApiQuery({
			name: 'limit',
			type: Number,
			required: false,
			example: 10,
			description: 'Number of users per page'
		}),
		ApiResponse({
			status: 200,
			description: 'Returns a list of users with pagination metadata',
			schema: {
				example: {
					users: [
						{
							id: 1,
							login: 'johndoe',
							fullname: 'John Doe',
							email: 'johndoe@example.com',
							avatarPath:
								'https://speakaboutit.s3.eu-north-1.amazonaws.com/default_avatar.png',
							role: 'ADMIN',
							rating: 0,
							isConfirm: true,
							confirmToken: null,
							createdAt: '2024-11-04T13:43:44.104Z',
							lastLogout: '2024-11-05T00:55:17.943Z',
							lastActive: '2024-11-05T01:02:47.133Z'
						}
					],
					totalCount: 100,
					page: 1,
					limit: 10,
					totalPages: 10,
					nextPage: 2,
					previousPage: null
				}
			}
		})
	)

export const ApiGetUserById = () =>
	applyDecorators(
		ApiOperation({ summary: 'Get user by ID' }),
		ApiParam({
			name: 'id',
			type: Number,
			example: 1,
			description: 'User ID'
		}),
		ApiResponse({
			status: 200,
			description: 'Returns user details',
			schema: {
				example: {
					id: 1,
					login: 'johndoe',
					fullname: 'John Doe',
					email: 'johndoe@example.com',
					avatarPath:
						'https://speakaboutit.s3.eu-north-1.amazonaws.com/default_avatar.png',
					role: 'ADMIN',
					rating: 0,
					isConfirm: true,
					confirmToken: null,
					createdAt: '2024-11-04T13:43:44.104Z',
					lastLogout: '2024-11-05T00:55:17.943Z',
					lastActive: '2024-11-05T01:02:47.133Z'
				}
			}
		}),
		ApiResponse({
			status: 404,
			description: 'User not found',
			schema: { example: { message: 'User with this id doesn’t exist' } }
		})
	)

export const ApiCreateUser = () =>
	applyDecorators(
		ApiOperation({ summary: 'Create a new user' }),
		ApiBody({
			type: CreateUserDto,
			description: 'Data for new user',
			examples: {
				example: {
					summary: 'Example user creation',
					value: {
						login: 'user123',
						fullname: 'John Doe',
						email: 'johndoe@example.com',
						password: 'password123',
						password_confirm: 'password123',
						role: Role.USER
					}
				}
			}
		}),
		ApiResponse({
			status: 201,
			description: 'User successfully created',
			schema: {
				example: {
					id: 25,
					login: 'user123',
					fullname: 'John Doe',
					email: 'johndoe@example.com',
					avatarPath: 'default_avatar.png',
					role: 'USER',
					rating: 0,
					isConfirm: true,
					confirmToken: null,
					createdAt: '2024-11-05T15:32:50.899Z',
					lastLogout: null,
					lastActive: null
				}
			}
		}),
		ApiResponse({
			status: 400,
			description: 'Password mismatch or user already exists',
			schema: { example: { message: 'Password must be the same' } }
		})
	)

export const ApiUpdateUserAvatar = () =>
	applyDecorators(
		ApiOperation({ summary: 'Update user avatar' }),
		ApiBody({
			type: AvatarDto,
			description: 'Data to upload user avatar'
		}),
		ApiResponse({
			status: 200,
			description: 'Avatar updated successfully',
			schema: {
				example: {
					id: 25,
					login: 'user123',
					fullname: 'John Doe',
					email: 'johndoe@example.com',
					avatarPath:
						'https://speakaboutit.s3.eu-north-1.amazonaws.com/b064b853-4a31-4413-84db-27940a740628-2024-09-14%2021.22.36.jpg',
					role: 'USER',
					rating: 0,
					isConfirm: true,
					confirmToken: null,
					createdAt: '2024-11-05T15:32:50.899Z',
					lastLogout: null,
					lastActive: null
				}
			}
		}),
		ApiResponse({
			status: 404,
			description: 'User not found',
			schema: { example: { message: 'User with this id doesn’t exist' } }
		})
	)

export const ApiUpdateUserInfo = () =>
	applyDecorators(
		ApiOperation({ summary: 'Update user information' }),
		ApiParam({
			name: 'id',
			type: Number,
			example: 1,
			description: 'User ID'
		}),
		ApiBody({
			type: UpdateUserDto,
			description: 'Data to update user information',
			examples: {
				example: {
					summary: 'Example user update',
					value: {
						fullname: 'John Smith',
						email: 'johnsmith@example.com'
					}
				}
			}
		}),
		ApiResponse({
			status: 200,
			description: 'User information updated successfully',
			schema: {
				example: {
					id: 1,
					login: 'JohnSmith',
					fullname: 'Andrii Zhupanov',
					email: 'johnsmith@example.com',
					avatarPath:
						'https://speakaboutit.s3.eu-north-1.amazonaws.com/default_avatar.png',
					role: 'ADMIN',
					rating: 0,
					isConfirm: true,
					confirmToken: null,
					createdAt: '2024-11-04T13:43:44.104Z',
					lastLogout: '2024-11-05T00:55:17.943Z',
					lastActive: '2024-11-05T15:35:06.263Z'
				}
			}
		}),
		ApiResponse({
			status: 403,
			description: 'Forbidden access',
			schema: {
				example: { message: 'You don’t have access to update another user' }
			}
		}),
		ApiResponse({
			status: 404,
			description: 'User not found',
			schema: { example: { message: 'User with this id doesn’t exist' } }
		})
	)

export const ApiDeleteUser = () =>
	applyDecorators(
		ApiOperation({ summary: 'Delete user by ID' }),
		ApiParam({
			name: 'id',
			type: Number,
			example: 1,
			description: 'User ID'
		}),
		ApiResponse({ status: 204, description: 'User deleted successfully' }),
		ApiResponse({
			status: 403,
			description: 'Forbidden access',
			schema: {
				example: { message: 'You don’t have access to remove another user' }
			}
		}),
		ApiResponse({
			status: 404,
			description: 'User not found',
			schema: { example: { message: 'User with this id doesn’t exist' } }
		})
	)
export const ApiGetFavoritePosts = () =>
	applyDecorators(
		ApiOperation({
			summary:
				'Get favorite posts for the user with pagination and default sort by date'
		}),
		ApiQuery({
			name: 'page',
			type: Number,
			required: false,
			example: 1,
			description: 'Current page number'
		}),
		ApiQuery({
			name: 'limit',
			type: Number,
			required: false,
			example: 10,
			description: 'Number of posts per page'
		}),
		ApiResponse({
			status: 200,
			description: 'Returns a paginated list of favorite posts for the user',
			schema: {
				example: {
					posts: [
						{
							postId: 1,
							userId: 1,
							addAt: '2024-11-04T15:02:51.263Z',
							post: {
								id: 1,
								publishAt: '2024-05-17T00:14:07.167Z',
								status: 'ACTIVE',
								content: 'Content of the post',
								title: 'Title of the post',
								authorId: 14,
								rating: 0
							}
						}
					],
					totalCount: 1,
					page: 1,
					limit: 10,
					totalPages: 1,
					nextPage: null,
					previousPage: null
				}
			}
		}),
		ApiResponse({
			status: 404,
			description: 'User or posts not found',
			schema: {
				example: { message: 'User does not have any favorite posts' }
			}
		})
	)

export const ApiGetSubscribePosts = () =>
	applyDecorators(
		ApiOperation({
			summary:
				'Get subscribe posts for the user with pagination and default sort by date'
		}),
		ApiQuery({
			name: 'page',
			type: Number,
			required: false,
			example: 1,
			description: 'Current page number'
		}),
		ApiQuery({
			name: 'limit',
			type: Number,
			required: false,
			example: 10,
			description: 'Number of posts per page'
		}),
		ApiResponse({
			status: 200,
			description: 'Returns a paginated list of subscribe posts for the user',
			schema: {
				example: {
					posts: [
						{
							postId: 1,
							userId: 1,
							addAt: '2024-11-04T15:02:51.263Z',
							post: {
								id: 1,
								publishAt: '2024-05-17T00:14:07.167Z',
								status: 'ACTIVE',
								content: 'Content of the post',
								title: 'Title of the post',
								authorId: 14,
								rating: 0
							}
						}
					],
					totalCount: 1,
					page: 1,
					limit: 10,
					totalPages: 1,
					nextPage: null,
					previousPage: null
				}
			}
		}),
		ApiResponse({
			status: 404,
			description: 'User or posts not found',
			schema: {
				example: { message: 'User does not have any subscribe posts' }
			}
		})
	)
