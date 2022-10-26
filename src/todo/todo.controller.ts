import { Controller, Delete, Get, Put,Post, Res, Body, Param, NotFoundException, Query, ParseIntPipe, HttpStatus, ValidationPipe, UseInterceptors } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { GetPaginatedTodoDto } from './entities/dto/get-paginated-todo.dto';
import { AddTodoDto } from './entities/dto/add-todo.dto';
import { TodoService } from './todo.service';
import { UpperAndFusionPipe } from 'src/pipes/upper-and-fusion.pipe';
import { DurationInterceptor } from 'src/interceptors/duration.interceptor';
import { getMaxListeners } from 'process';
import { request } from 'http';

@UseInterceptors(DurationInterceptor)
@Controller('todo')
export class TodoController {
    constructor(private todoService:TodoService){
    }
    @Get()
    getTodos1(@Query() mesQueryParams:GetPaginatedTodoDto):Todo[] {
    
      // console.log(mesQueryParams instanceof GetPaginatedTodoDto)
        return this.todoService.getTodos();
    }
    @Get(':id')
    getTodoById(@Param('id',new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND })) id) {
return this.todoService.getTodoById(id);
    }
    @Post()
    addTodo(@Body(ValidationPipe) newTodo: AddTodoDto):Todo {
        console.log(newTodo)
       return this.todoService.addTodo(newTodo);
}
    @Delete(':id')
    deleteTodo(@Param('id',ParseIntPipe)id) {
      return this.todoService.deleteTodo(id);
    }
    @Post('/pipes')
    testPipe(@Body(UpperAndFusionPipe)data){
        return data;
    }
    @Put(':id')
    updateTodo( @Param('id',new ParseIntPipe({
         errorHttpStatusCode: HttpStatus.NOT_FOUND })) id,
    @Body() newTodo: Partial<AddTodoDto> 
    ) {
     return this.todoService.updateTodo(id,newTodo)
    }}

    // @Get()
    // async getMaxListeners(@Req() request:Request):Promise<ChallengeEntity[]>
    // {
    //   const user = request.user;
    //   .....
    // }