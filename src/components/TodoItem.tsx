/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, completed: boolean) => void;
  onTitleChange: (id: number, title: string) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  isUpdating?: boolean;
  errorHappened?: boolean;
  editSucceeded?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onStatusChange,
  onTitleChange,
  isDeleting = false,
  isLoading = false,
  isUpdating = false,
  errorHappened = false,
  editSucceeded = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (errorHappened && isEditing && editInputRef.current) {
      editInputRef.current.focus();

      const length = editInputRef.current.value.length;

      editInputRef.current.setSelectionRange(length, length);
    }
  }, [errorHappened, isEditing]);

  useEffect(() => {
    if (editSucceeded && isEditing) {
      setIsEditing(false);
    }
  }, [editSucceeded, isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setNewTitle(todo.title);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleTitleSubmit = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (trimmedTitle === '') {
      onDelete(todo.id);
    } else {
      onTitleChange(todo.id, trimmedTitle);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onStatusChange(todo.id, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleTitleSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editInputRef}
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={() => {
              if (!errorHappened) {
                handleTitleSubmit();
              }
            }}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isDeleting || isLoading || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
