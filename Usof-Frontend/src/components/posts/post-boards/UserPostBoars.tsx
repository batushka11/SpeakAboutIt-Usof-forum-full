import {
	Box,
	Button,
	Flex,
	Input,
	Select,
	SimpleGrid,
	Spinner,
	Text,
	useToast
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactSelect, { MultiValue } from 'react-select'
import apiClient from '../../../helpers/axios'
import { useAppSelector } from '../../../hooks/reduxHooks'
import Pagination from '../../home/Pagination'
import fetchPostsWithDetails, { Post } from '../FetchPosts'
import PostCard from '../post-card/PostCard'

const UserPostsBoard: React.FC = () => {
	const toast = useToast()
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()
	const { user } = useAppSelector(state => state.auth)
	const [posts, setPosts] = useState<Post[]>([])
	const [loading, setLoading] = useState(false)
	const [totalPages, setTotalPages] = useState(1)
	const [categories, setCategories] = useState<
		{ label: string; value: string }[]
	>([])
	const [filters, setFilters] = useState({
		title: '',
		startDate: '',
		endDate: '',
		categories: [] as string[],
		sortBy: 'publishAt',
		order: 'desc',
		status: '',
		limit: ''
	})
	const [tempFilters, setTempFilters] = useState(filters)

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await apiClient.get('/categories')
				setCategories(
					response.data.map((category: { id: string; title: string }) => ({
						label: category.title,
						value: category.id
					}))
				)
			} catch (error) {}
		}
		fetchCategories()
	}, [])

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true)
			try {
				const queryParams = new URLSearchParams({
					page: id || '1',
					size: filters.limit,
					...(filters.title && { title: filters.title.trim() }),
					...(filters.startDate && { 'date[start]': filters.startDate }),
					...(filters.endDate && { 'date[end]': filters.endDate }),
					...(filters.sortBy && { sortBy: filters.sortBy }),
					...(filters.order && { order: filters.order }),
					...(filters.status && { status: filters.status })
				})
				filters.categories.forEach(category => {
					queryParams.append('category', category)
				})
				const response = await apiClient.get(
					`/users/${user.id}/posts?${queryParams.toString()}`
				)
				const detailedPosts = await fetchPostsWithDetails(
					`/users/${user.id}/posts?${queryParams.toString()}`
				)
				setPosts(detailedPosts)
				setTotalPages(response.data.totalPages)
				if (detailedPosts.length < 1) {
					toast({
						title: 'Don`t found any posts',
						status: 'error',
						duration: 3000,
						isClosable: true
					})
				}
			} catch (error) {
			} finally {
				setLoading(false)
			}
		}
		window.scrollTo({ top: 0 })
		fetchPosts()
	}, [id, user.id, filters, toast])

	const handleFilterChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setTempFilters(prevTempFilters => ({
			...prevTempFilters,
			[e.target.name]: e.target.value
		}))
	}

	const handleCategoryChange = (
		selectedOptions: MultiValue<{ label: string; value: string }>
	) => {
		setTempFilters(prevTempFilters => ({
			...prevTempFilters,
			categories: selectedOptions.map(option => {
				const category = categories.find(c => c.value === option.value)
				return category ? category.label : ''
			})
		}))
	}

	const resetFilters = () => {
		setTempFilters({
			title: '',
			startDate: '',
			endDate: '',
			categories: [],
			sortBy: '',
			order: '',
			status: '',
			limit: ''
		})
		setFilters({
			title: '',
			startDate: '',
			endDate: '',
			categories: [],
			sortBy: 'publishAt',
			order: 'desc',
			status: '',
			limit: ''
		})
	}

	const applyFilters = () => {
		setFilters(tempFilters)
	}

	return (
		<Box>
			<Text fontSize="3vh" fontWeight="extrabold" mb="4" textAlign="center">
				My Posts
			</Text>

			<Flex
				flexWrap="wrap"
				gap="4"
				p="4"
				bg="brand.0"
				borderRadius="md"
				justifyContent="center"
				alignItems="center"
				mb="6"
			>
				<Input
					placeholder={filters.title !== '' ? filters.title : 'Search by title'}
					name="title"
					value={tempFilters.title}
					onChange={handleFilterChange}
				/>
				<Flex direction="row" align="center" width="100%" gap="10px">
					<Text width="auto" flexShrink={0}>
						Start date
					</Text>
					<Input
						placeholder="Start date"
						type="date"
						name="startDate"
						value={tempFilters.startDate}
						onChange={handleFilterChange}
						flex="1"
					/>
				</Flex>
				<Flex direction="row" align="center" width="100%" gap="10px">
					<Text width="auto" flexShrink={0} mr="2">
						End date
					</Text>
					<Input
						placeholder="End date"
						type="date"
						name="endDate"
						value={tempFilters.endDate}
						onChange={handleFilterChange}
						flex="1"
					/>
				</Flex>
				<Box width="400px">
					<ReactSelect
						options={categories}
						isMulti
						onChange={handleCategoryChange}
						placeholder="Select categories"
					/>
				</Box>
				<Select
					placeholder="Status"
					name="status"
					value={tempFilters.status}
					onChange={handleFilterChange}
					width="150px"
				>
					<option value="ACTIVE">Active</option>
					<option value="INACTIVE">Inactive</option>
				</Select>
				<Select
					placeholder="Sort by"
					name="sortBy"
					value={tempFilters.sortBy}
					onChange={handleFilterChange}
					width="150px"
				>
					<option value="publishAt">Publish Date</option>
					<option value="rating">Rating</option>
					<option value="title">Title</option>
				</Select>
				<Select
					placeholder="Order"
					name="order"
					value={tempFilters.order}
					onChange={handleFilterChange}
					width="120px"
				>
					<option value="asc">Ascending</option>
					<option value="desc">Descending</option>
				</Select>
				<Select
					placeholder="Posts per page"
					name="limit"
					value={tempFilters.limit}
					onChange={handleFilterChange}
					width="150px"
				>
					<option value="5">5</option>
					<option value="10">10</option>
					<option value="20">20</option>
					<option value="50">50</option>
				</Select>
				<Flex gap="2">
					<Button colorScheme="brand" color="white" onClick={applyFilters}>
						Apply Filters
					</Button>
					<Button colorScheme="gray" onClick={resetFilters}>
						Reset Filters
					</Button>
				</Flex>
			</Flex>

			{loading ? (
				<Flex justify="center" align="center" minH="200px">
					<Spinner size="xl" />
				</Flex>
			) : posts.length < 1 ? (
				<Text>You don't have any posts</Text>
			) : (
				<>
					<SimpleGrid columns={1} spacing="6">
						{posts.map(post => (
							<PostCard key={post.id} post={post} />
						))}
					</SimpleGrid>
					{totalPages > 1 && (
						<Pagination
							currentPage={Number(id)}
							totalPages={totalPages}
							onPageChange={page => navigate(`/my-posts/${page}`)}
						/>
					)}
				</>
			)}
		</Box>
	)
}

export default UserPostsBoard
