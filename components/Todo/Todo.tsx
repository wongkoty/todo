import React, { FC, useState } from 'react';
import { format } from 'date-fns';

import { ITodo } from '../../src/typings';

interface IProps {
  todo: ITodo;
}

export const Todo: FC<IProps> = ({ todo }) => {
  const [isComplete, setIsComplete] = useState<boolean>(todo.isComplete);

  const updateIsCompletedTodo = async (id: string, isComplete: boolean) => {
    return fetch(`https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/patch/${id}`, {
      method: 'PATCH',
      headers: {
        'X-Api-Key': process.env.apikey as string,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isComplete: !isComplete
      })
    });
  }

  const getBackgroundColor = (isComplete: boolean, dueDate: string | null) => {
    if (isComplete) return 'lightgreen';

    if (dueDate && new Date(dueDate).getTime() < new Date().getTime()) return 'pink' 
      
    return 'grey';
  }

  return (
    <div
      style={{
        justifyContent: 'space-between',
        display: 'flex',
        backgroundColor: getBackgroundColor(todo.isComplete, todo.dueDate),
        margin: '24px 0',
        padding: '24px 0'
      }}
    >
      <div
        style={{ flexBasis: '15%', padding: '0 24px' }}
      >
        <input 
          type='checkbox'
          checked={isComplete}
          onChange={async () => {
            const res = await updateIsCompletedTodo(todo.id, isComplete);
            const body = await res.json();

            if (body.status === 'success') {
              setIsComplete(prev => !prev);
            }
          }}
        />
      </div>
      <div
        style={{ flexBasis: '20% '}}
      >
        <span style={{ textDecorationLine: todo.isComplete ? 'line-through' : undefined }}>{todo.description}</span>
      </div>
      <div
        style={{ flexBasis: '65%', alignSelf: 'center' }}  
      >
        {todo.dueDate ? format(new Date(todo.dueDate), 'MM/dd/yyyy') : ''}
      </div>
    </div>
  )
}
