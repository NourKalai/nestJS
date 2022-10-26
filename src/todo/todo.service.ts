import { Injectable, NotFoundException } from '@nestjs/common';
import { AddTodoDto } from './entities/dto/add-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
    todos:Todo[]=[];

    getTodos():Todo[]{
        return this.todos;
    }
    addTodo(newTodo: AddTodoDto):Todo{
        const {name,description}= newTodo;
        let id;
        if (this.todos.length)
        {id = this.todos[this.todos.length -1].id +1}
    else {  id =1;}
  const todo= {id, name,description,createdAt:new Date()};
this.todos.push(todo);
return todo;
  
    }
    getTodoById(id):Todo{
        const todo = this.todos.find((actualTodo) => actualTodo.id === +id);
       if (todo) return todo;
       throw new NotFoundException(`le Todo d'ID ${id} n''existe pas`);

    }
    deleteTodo(id:number){
          //chercher l'objet via son id
          const index = this.todos.findIndex((todo)=> todo.id ===+id);
          //utiliser la méthode slice pour supprimer s'il existe
          if (index>=0 ){
              this.todos.splice(index,1);
          }
          //sinon je vais déclencher une exception
          else {
              throw new NotFoundException(`Le todo d'ID ${id} n'existe pas`);
          }
          return{ message:`Le todo d'ID ${id} a été supprimé avec succès`}
          
    }
    updateTodo(id:number,newTodo:Partial<Todo>){
        const todo= this.getTodoById(id);
        todo.description= newTodo.description? newTodo.description:todo.description;
        todo.name= newTodo.name? newTodo.name:todo.name;

        console.log(todo);
        return todo;
    }
}
