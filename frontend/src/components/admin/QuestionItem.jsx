import { TrashIcon, PencilIcon } from '@heroicons/react/solid';

const QuestionItem = ({ question, index, onEdit, onDelete }) => {
  return (
    <li className={`flex flex-col p-4 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
      <div className="flex justify-between">
        <span className="text-lg">{question.question}</span>
        <div>
          <button onClick={onEdit} className="btn btn-sm btn-primary mr-2">
            <PencilIcon className="h-5 w-5 text-white" />
          </button>
          <button onClick={onDelete} className="btn btn-sm btn-error">
            <TrashIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
      <div>
        <ul className="list-inside">
          {question.options.map((option, idx) => (
            <li key={idx} className={`text-sm ${option === question.correctAnswer ? 'text-green-500' : ''}`}>
              {option}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default QuestionItem;
