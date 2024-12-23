import apiClient from '../../helpers/axios'

interface Category {
	title: string
	description: string
}

interface Comments {
	id: number
	author: {
		login: string
		avatar: string
		activity: string
	}
	content: string
	createdAt: string
	updateAt: string
	rating: number
}

export interface Post {
	id: number
	title: string
	content: string
	publishAt: string
	rating: number
	status: string
	author: {
		id: number
		login: string
		avatar: string
		activity: string
	}
	comments: Comments[]
	categories: Category[]
	commentsCount: number
	isBookmarked: boolean
	isSubscribed: boolean
}

const fetchPostsWithDetails = async (path: string): Promise<Post[]> => {
	const response = await apiClient.get(path)
	const posts = response.data.posts

	const detailedPosts = await Promise.all(
		posts.map(async (post: any) => {
			try {
				const [author, categoriesResponse, commentsResponse] =
					await Promise.all([
						apiClient.get(`/users/${post.authorId}`),
						apiClient.get(`/posts/${post.id}/categories`),
						apiClient.get(`/posts/${post.id}/comments`)
					])

				const categories =
					categoriesResponse?.data?.map((c: any) => ({
						title: c.category?.title,
						description: c.category?.description
					})) || []
				const commentsCount = commentsResponse?.data?.totalComments
				return {
					...post,
					author: {
						id: author.data.id,
						login: author.data.login,
						avatar: author.data.avatarPath,
						activity: author.data.lastActive
					},
					categories,
					commentsCount
				}
			} catch (error) {}
		})
	)

	return detailedPosts
}

export default fetchPostsWithDetails
