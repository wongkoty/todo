import React, { FC, useState } from 'react';
import { format } from 'date-fns';

import { ITodo } from '../../src/typings';

type BackgroundColors = 'grey' | 'lightgreen' | 'pink';

interface IProps {
  todo: ITodo;
}

interface PageState {
  todo: ITodo;
  backgroundColor: BackgroundColors;
}

const getBackgroundColor = (isComplete: boolean, dueDate: string | null): BackgroundColors => {
  if (isComplete) return 'lightgreen';

  if (dueDate && new Date(dueDate).getTime() < new Date().getTime()) return 'pink' 
    
  return 'grey';
}

export const Todo: FC<IProps> = ({ todo }) => {
  const [pageState, setPageState] = useState<PageState>({
    todo,
    backgroundColor: getBackgroundColor(todo.isComplete, todo.dueDate)
  });

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

  const handleChange = async () => {
    const res = await updateIsCompletedTodo(pageState.todo.id, pageState.todo.isComplete);
    const body = await res.json();

    if (body.status === 'success') {
      setPageState(prev => {
        return {
          todo: {
            ...prev.todo,
            isComplete: !prev.todo.isComplete,
          },
          backgroundColor: getBackgroundColor(!prev.todo.isComplete, pageState.todo.dueDate)
        }
      })
    }
  }

  return (
    <div
      style={{
        justifyContent: 'space-between',
        display: 'flex',
        backgroundColor: pageState.backgroundColor,
        margin: '24px 0',
        padding: '24px 0'
      }}
    >
      <div
        style={{ flexBasis: '15%', padding: '0 24px' }}
      >
        <input 
          type='checkbox'
          checked={pageState.todo.isComplete}
          onChange={async () => await handleChange()}
        />
      </div>
      <div
        style={{ flexBasis: '65% '}}
      >
        <span style={{ textDecorationLine: pageState.todo.isComplete ? 'line-through' : undefined }}>{pageState.todo.description}</span>
      </div>
      <div
        style={{ flexBasis: '20%', alignSelf: 'center' }}  
      >
        {pageState.todo.dueDate ? format(new Date(pageState.todo.dueDate), 'MM/dd/yyyy') : ''}
      </div>
    </div>
  )
}
