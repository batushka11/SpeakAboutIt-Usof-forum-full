import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UploadedFile,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Role, User } from '@prisma/client'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import {
	Pagination,
	PaginationParams
} from 'src/pagination/pagination_params.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { Roles } from './decorators/role.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { HttpExceptionFilter } from './filter/http-exception.filter'
import { RolesGuard } from './guards/role.guard'
import { UserService } from './user.service'
import { avatarFileInterceptor } from './util/file-upload.util'

import { Filtering } from 'src/filtering/filter.interface'
import { FilteringParams } from 'src/filtering/filter_params.decorator'
import { Sorting } from 'src/sorting/sort.interface'
import { SortingParams } from 'src/sorting/sort_params.decorator'
import {
	ApiCreateUser,
	ApiDeleteUser,
	ApiGetAllUsers,
	ApiGetFavoritePosts,
	ApiGetSubscribePosts,
	ApiGetUserById,
	ApiUpdateUserAvatar,
	ApiUpdateUserInfo
} from './docs/user.swagger'

@ApiTags('Users')
@ApiBearerAuth()
@Auth()
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiGetSubscribePosts()
	@HttpCode(200)
	@Get('/subscribe')
	async getSubscribePost(
		@CurrentUser('id') id: number,
		@PaginationParams() paginationParams: Pagination,
		@SortingParams() sortingParams: Sorting,
		@FilteringParams() filteringParams: Filtering
	) {
		return this.userService.getSubscribePost(
			id,
			paginationParams,
			sortingParams,
			filteringParams
		)
	}

	@HttpCode(200)
	@Get('/:id/posts')
	async getUserPost(
		@CurrentUser() user: User,
		@Param('id', ParseIntPipe) userId: number,
		@PaginationParams() paginationParams: Pagination,
		@SortingParams() sortingParams: Sorting,
		@FilteringParams() filteringParams: Filtering
	) {
		return this.userService.getUserPost(
			userId,
			paginationParams,
			sortingParams,
			filteringParams,
			user
		)
	}

	@ApiGetFavoritePosts()
	@HttpCode(200)
	@Get('/favorite')
	async getFavoritePost(
		@CurrentUser('id') id: number,
		@PaginationParams() paginationParams: Pagination,
		@SortingParams() sortingParams: Sorting,
		@FilteringParams() filteringParams: Filtering
	) {
		return this.userService.getFavoritePost(
			id,
			paginationParams,
			sortingParams,
			filteringParams
		)
	}

	@ApiGetAllUsers()
	@HttpCode(200)
	@Get()
	async getUsers(
		@PaginationParams() paginationParams: Pagination,
		@SortingParams() sortingParams: Sorting
	) {
		return this.userService.getAllUsers(paginationParams, sortingParams)
	}

	@ApiGetUserById()
	@HttpCode(200)
	@Get('/:id')
	async getUser(@Param('id', ParseIntPipe) id: number) {
		return this.userService.getUserById(id)
	}

	@UsePipes(new ValidationPipe())
	@Roles(Role.ADMIN)
	@ApiCreateUser()
	@HttpCode(201)
	@Post()
	async addUser(@Body() dto: CreateUserDto) {
		return this.userService.createUser(dto)
	}

	@ApiUpdateUserAvatar()
	@HttpCode(200)
	@Patch('/avatar')
	@UseInterceptors(avatarFileInterceptor())
	@UseFilters(new HttpExceptionFilter())
	async addAvatar(
		@CurrentUser('id') id: number,
		@UploadedFile() file: Express.Multer.File
	) {
		return this.userService.updateUserAvatar(id, file)
	}

	@ApiUpdateUserInfo()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Patch('/:id')
	async updateUserInfo(
		@Body() dto: UpdateUserDto,
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: User
	) {
		return this.userService.updateUser(id, dto, user)
	}

	@ApiDeleteUser()
	@HttpCode(204)
	@Delete('/:id')
	async deleteUser(
		@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: User
	) {
		return this.userService.removeById(id, user)
	}
}
