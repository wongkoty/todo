import { useEffect, useState } from 'react';

import { Todo } from '../components/Todo';
import { ITodo } from '../src/typings';

export default function Home() {
  const [todos, setTodos] = useState<Array<ITodo>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getTodos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/get', {
        headers: {
          'X-Api-Key': process.env.apikey as string
        }
      });
      const data = await res.json();
      data.sort((a: ITodo, b: ITodo) => {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
  
        const isCompleteA = a.isComplete ? 0 : -1;
        const isCompleteB = b.isComplete ? 0 : -1;
  
        return isCompleteA - isCompleteB || aDate - bDate;
      })

      setTodos(data);
    } catch (error) {
      setError(true);
    }
    
    // Stimulate loading state
    setTimeout(() => setIsLoading(false), 1000);
  }

  useEffect(() => {
    getTodos();
  }, [])


  return (
    <div>
      <h1>A todo app</h1>
      {isLoading && (
        <div><h1>Loading...</h1></div> 
      )}
      {error && (
        <div><h1>Something has gone wrong</h1></div> 
      )}
      {!isLoading && !error && (
        <div style={{ margin: '0 auto', width: '600px' }}>
          {todos.map(todo => <Todo key={todo.id} todo={todo} /> )}
        </div>
      )}
    </div>
  )
}
